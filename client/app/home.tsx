import TeamRow from '@/components/TeamRow';
import { ThemedText, ThemedView } from '@/components/themed/ThemedComponents';
import Theme from '@/constants/Theme';
import { League, StatRound, Team, TeamInfo } from '@/user/api';
import { leagueTrios } from '@/user/teams';
import { TeamTrio } from '@/user/teamTrio';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { SVGAttributes, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type TotalStats = {
  wins: number;
  loses: number;
};

const StatCircle = ({ stats, style }: SVGAttributes<SVGSVGElement> & { stats: TotalStats }) => {
  const total = stats.loses + stats.wins;
  const radius = 30;
  const strokeWidth = 5;
  const space = (strokeWidth / 300) * Math.PI * 2;
  const cx = 50;
  const cy = 50;

  const arcPath = (startDeg: number, endDeg: number) => {
    if (startDeg === endDeg) return '';

    const degLength = endDeg - startDeg - space * 2;
    const sx = cx + radius * Math.cos(space + startDeg);
    const sy = cy + radius * Math.sin(space + startDeg);
    const ex = cx + radius * Math.cos(endDeg - space);
    const ey = cy + radius * Math.sin(endDeg - space);
    let d = `M ${sx} ${sy} A ${radius} ${radius}, 0, ${degLength > Math.PI ? 1 : 0}, 1, ${ex} ${ey}`;
    return d;
  };

  // lose bar
  const loses = stats.loses;
  const loseDeg = (total === 0 ? total : loses / total) * Math.PI * 2;
  let ld = arcPath(0, loseDeg);

  // win bar
  const wins = stats.wins;
  const winDeg = (total === 0 ? total : wins / total) * Math.PI * 2;
  let wd = arcPath(loseDeg, winDeg + loseDeg);

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={style}>
      <g transform={`rotate(-90 ${cx} ${cy})`}>
        <circle cx={cx} cy={cy} r={radius - 5} fill="#677" />
        <path d={wd} fill="transparent" stroke={Theme.win} strokeWidth={strokeWidth} strokeLinecap="round" />
        <path d={ld} fill="transparent" stroke={Theme.lose} strokeWidth={strokeWidth} strokeLinecap="round" />
      </g>
      <text
        x={cx}
        y={cy + 4}
        fill="white"
        fontSize={30}
        fontWeight={'bold'}
        fontFamily="Arial"
        dominantBaseline="middle"
        textAnchor="middle"
      >
        {wins}
      </text>
    </svg>
  );
};

type StatFilter = {
  round: StatRound;
  visible: boolean;
};

interface DisplayTeam {
  info: TeamInfo;
  stats: TotalStats;
}

interface DisplayLeague {
  league: League;
  teams: DisplayTeam[];
}

const Home = () => {
  const getTeamFilteredStats = (team: Team, filters: StatFilter[] | undefined = undefined): TotalStats => {
    return team.stats
      ? team.stats.reduce(
          (total, stat) => {
            if (!filters || filters.some((filter) => filter.round === stat.round && filter.visible)) {
              total.wins += stat.total.games.wins;
              total.loses += stat.total.games.loses;
            }
            return total;
          },
          { wins: 0, loses: 0 } as TotalStats
        )
      : { wins: 0, loses: 0 };
  };

  const getTeamTotalStats = (team: Team) => {
    return getTeamFilteredStats(team);
  };

  const getTotalFilteredStats = (filters: StatFilter[] | undefined = undefined): TotalStats => {
    const stats: TotalStats = { wins: 0, loses: 0 };

    leagueTrios.forEach((trio) => {
      trio.getTeams().forEach((team) => {
        const teamStats = getTeamFilteredStats(team, filters);
        stats.wins += teamStats.wins;
        stats.loses += teamStats.loses;
      });
    });

    return stats;
  };

  const getTotalStats = () => {
    return getTotalFilteredStats();
  };

  const toggleStatFilter = (round: StatRound) => {
    setRoundFilters(
      roundFilters.map((filter) =>
        filter.round === round ? { round: filter.round, visible: !filter.visible } : filter
      )
    );
  };

  const toggleFilterVisibility = () => {
    setRoundFiltersVisible(!roundFiltersVisible);
  };

  const getDisplayLeagues = (leagues: TeamTrio[], filters: StatFilter[] | undefined = undefined): DisplayLeague[] => {
    return leagues.map((trio) => ({
      league: trio.league,
      teams: trio
        .getTeams()
        .map((team) => ({ info: team.info, stats: getTeamFilteredStats(team, filters) }))
        .toSorted((a, b) => b.stats.wins - a.stats.wins),
    }));
  };

  const [totalStats, setTotalStats] = useState(getTotalStats());

  const rounds: StatRound[] = ['regular-season', 'post-season', 'preseason'] as const;

  const [roundFilters, setRoundFilters] = useState(rounds.map((round) => ({ round, visible: true })));

  const [displayLeagues, setDisplayLeagues] = useState(getDisplayLeagues([...leagueTrios], roundFilters));

  const [roundFiltersVisible, setRoundFiltersVisible] = useState(false);

  useEffect(() => {
    setTotalStats(getTotalFilteredStats(roundFilters));

    setDisplayLeagues(getDisplayLeagues([...leagueTrios], roundFilters));
  }, [roundFilters]);

  /**
   * Returns round that looks more like a title
   * @param round a stat round
   */
  const statRoundTitle = (round: StatRound) => {
    return round
      .replaceAll('-', ' ')
      .split(' ')
      .map((word) => word[0].toUpperCase() + word.substring(1))
      .reduce((prev, word) => prev + (prev.length > 0 ? ' ' : '') + word, '');
  };

  return (
    <ThemedView style={[styles.container, { alignItems: 'stretch' }]} safe={true}>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          paddingVertical: 12,
          paddingHorizontal: 12,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <ThemedText type="title">Future Football</ThemedText>
        </View>

        <View style={styles.graphic_container}>
          {/* Filter options */}
          <View style={styles.filter_container}>
            <View style={styles.filter_top_row}>
              <Pressable
                onPress={toggleFilterVisibility}
                style={({ pressed }) => [
                  styles.filter_option_btn,
                  pressed ? styles.filter_option_btn_pressed : undefined,
                ]}
              >
                {({ pressed }) => <Ionicons name="options-sharp" size={24} color={pressed ? Theme.text : Theme.sub} />}
              </Pressable>

              {roundFiltersVisible && (
                <Pressable
                  onPress={toggleFilterVisibility}
                  style={({ pressed }) => [
                    styles.filter_option_btn,
                    pressed ? styles.filter_option_btn_pressed : undefined,
                  ]}
                >
                  {({ pressed }) => <AntDesign name="close" size={24} color={pressed ? Theme.text : Theme.sub} />}
                </Pressable>
              )}
            </View>
            {roundFiltersVisible && (
              <View style={styles.filter_options}>
                {roundFilters.map((filter) => {
                  return (
                    <Pressable
                      style={({ pressed }) => [
                        styles.filter_option,
                        pressed ? styles.filter_option_pressed : undefined,
                      ]}
                      onPress={() => toggleStatFilter(filter.round)}
                    >
                      <FontAwesome name={filter.visible ? 'circle' : 'circle-o'} size={20} color={Theme.main} />
                      <ThemedText style={styles.filter_option_text}>{statRoundTitle(filter.round)}</ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>

          <StatCircle stats={totalStats} />
        </View>

        {displayLeagues.map((trio) => (
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 4, marginBottom: 4 }}>
              <ThemedText type={'subtitle'}>{trio.league} Teams</ThemedText>
              <Pressable
                style={({ pressed }) => [
                  { marginTop: 6, marginLeft: 6, borderRadius: '50%' },
                  pressed && { backgroundColor: Theme.subAlt },
                ]}
                onPress={() => {
                  // router.push({
                  //   pathname: '/teamSelect',
                  //   params: { league: trio.league },
                  // })
                  // todo: goto matches page?
                }}
              >
                <Entypo name="chevron-right" size={22} color={Theme.sub} />
              </Pressable>
            </View>
            {trio.teams.length > 0 ? (
              trio.teams.map((team, index) => {
                const total = team.stats;
                return (
                  <TeamRow
                    team={team.info}
                    key={trio.league + '-' + index}
                    button={
                      team.stats && (
                        <View style={{ flexDirection: 'row' }}>
                          <View style={styles.stat_text_container}>
                            <Text style={[styles.stat_text, { color: Theme.lose, textAlign: 'left' }]}>
                              {total.loses}
                            </Text>
                          </View>

                          <View style={styles.stat_text_container}>
                            <Text style={[styles.stat_text, { color: Theme.win }]}>{total.wins}</Text>
                          </View>
                        </View>
                      )
                    }
                  />
                );
              })
            ) : (
              <View style={{ paddingHorizontal: 8 }}>
                <ThemedText>You have no {trio.league} teams. Click the arrow to add teams.</ThemedText>
              </View>
            )}
          </View>
        ))}
      </View>
    </ThemedView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stat_text_container: {
    minWidth: 22,
    marginLeft: 4,
  },
  stat_text: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'right',
    width: '100%',
  },
  graphic_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: '25%',
    alignItems: 'stretch',
    position: 'relative',
  },
  filter_container: {
    zIndex: 1,
    position: 'absolute',
    top: '10%',
    left: 4,
    padding: 6,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: Theme.bg + 'dd',
    borderRadius: 10,
  },
  filter_top_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filter_options: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  filter_option: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 3,
    padding: 2,
    alignItems: 'center',
  },
  filter_option_pressed: {
    backgroundColor: '#fffc',
  },
  filter_option_btn: {
    padding: 3,
    borderRadius: 4,
  },
  filter_option_btn_pressed: {
    backgroundColor: '#0008',
  },
  filter_option_text: {
    fontWeight: '600',
    fontSize: 20,
  },
});
