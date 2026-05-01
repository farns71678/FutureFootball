import TeamRow from '@/components/TeamRow';
import { ThemedText, ThemedView } from '@/components/themed/ThemedComponents';
import Theme from '@/constants/Theme';
import { leagueTrios } from '@/user/teams';
import Entypo from '@expo/vector-icons/Entypo';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type TotalStats = {
  wins: number;
  loses: number;
};

const Home = () => {
  const getTotalStats = () => {
    const stats: TotalStats = { wins: 0, loses: 0 };

    leagueTrios.forEach((trio) => {
      trio.getTeams().forEach((team) => {
        if (team.stats) {
          stats.wins += team.stats.total.games.wins;
          stats.loses += team.stats.total.games.loses;
        }
      });
    });

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

        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View
            style={{
              backgroundColor: Theme.main,
              padding: 40,
              borderRadius: '50%',
              justifyContent: 'center',
              alignContent: 'center',
            }}
          >
            <View
              style={{
                aspectRatio: 1,
                height: 'auto',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ThemedText style={{ fontSize: 64, fontWeight: 'bold' }}> {totalStats.wins} </ThemedText>
            </View>
          </View>
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
                return (
                  <TeamRow
                    team={team.info}
                    key={trio.league + '-' + index}
                    button={
                      team.stats && (
                        <View style={{ flexDirection: 'row' }}>
                          <View>
                            <Text style={{ color: Theme.error }}>{team.stats.total.games.loses}</Text>
                          </View>

                          <View>
                            <Text style={{ color: Theme.text }}>{team.stats.total.games.wins}</Text>
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
