import TeamRow from '@/components/TeamRow';
import { ThemedText, ThemedView } from '@/components/themed/ThemedComponents';
import Theme from '@/constants/Theme';
import { Team } from '@/user/api';
import { leagueTrios } from '@/user/teams';
import Entypo from '@expo/vector-icons/Entypo';
import React, { SVGAttributes, useState } from 'react';
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
  // const deg = (loses / total) * Math.PI * 2;
  // const ax = radius * Math.cos(deg - space) + cx;
  // const ay = radius * Math.sin(deg - space) + cy;
  // let d = `M ${cx + radius * Math.cos(space)} ${cy + radius * Math.sin(space)} A ${radius} ${radius}, 0, ${deg > Math.PI ? 1 : 0}, 1, ${ax} ${ay}`;
  let ld = arcPath(0, loseDeg);

  // win bar
  const wins = stats.wins;
  const winDeg = (total === 0 ? total : wins / total) * Math.PI * 2;
  // const ldeg = (wins / total) * Math.PI * 2 + deg - space;
  // const wx = radius * Math.cos(deg + space) + cx;
  // const wy = radius * Math.sin(deg + space) + cx;
  // let wd = `M ${wx} ${wy} A ${radius} ${radius}, 0, ${ldeg - deg > Math.PI ? 1 : 0}, 1, ${radius * Math.cos(ldeg) + cx} ${radius * Math.sin(ldeg) + cy}`;
  let wd = arcPath(loseDeg, winDeg + loseDeg);

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={style}>
      <g transform={`rotate(-90 ${cx} ${cy})`}>
        <circle cx={cx} cy={cy} r={radius - 5} fill="#677" />
        <path d={wd} fill="transparent" stroke="skyblue" strokeWidth={strokeWidth} strokeLinecap="round" />
        <path d={ld} fill="transparent" stroke="red" strokeWidth={strokeWidth} strokeLinecap="round" />
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

const Home = () => {
  const getTeamTotalStats = (team: Team) => {
    return team.stats ? team.stats.reduce((total, stat) => {
      total.wins += stat.total.games.wins;
      total.loses += stat.total.games.loses;
      return total;
    }, { wins: 0, loses: 0 } as TotalStats) : { wins: 0, loses: 0 };
  }

  const getTotalStats = () => {
    const stats: TotalStats = { wins: 0, loses: 0 };

    console.log(leagueTrios);
    leagueTrios.forEach((trio) => {
      trio.getTeams().forEach((team) => {
        if (team.stats) {
          team.stats.forEach((stat) => {
          stats.wins += stat.total.games.wins;
          stats.loses += stat.total.games.loses;
          });
        }
      });
    });

    console.log(stats);
    return stats;
  };

  const [totalStats, setTotalStats] = useState(getTotalStats());

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

        <View style={{ flexDirection: 'row', justifyContent: 'center', height: '20%', alignItems: 'stretch' }}>
          <StatCircle stats={totalStats} style={{ height: '100%' }} />
        </View>

        {leagueTrios.map((trio) => (
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
                const total = getTeamTotalStats(team);
                return (
                  <TeamRow
                    team={team.info}
                    key={trio.league + '-' + index}
                    button={
                      team.stats && (
                        <View style={{ flexDirection: 'row' }}>
                          <View>
                            <Text style={{ color: Theme.error }}>{total.loses}</Text>
                          </View>

                          <View>
                            <Text style={{ color: Theme.text }}>{total.wins}</Text>
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
});
