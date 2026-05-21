import { ThemedText, ThemedView } from '@/components/themed/ThemedComponents';
import Theme from '@/constants/Theme';
import { getSeason, getTeamStats, League } from '@/user/api';
import { createTrio, TeamTrio } from '@/user/teamTrio';
import { useAuthStore } from '@/utils/authStore';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

type LoadedState = 'loading' | 'loaded' | 'error' | 'finalized';

const index = () => {
  const { user, userToken, setLeaguePicks, setDataLoaded } = useAuthStore();

  const router = useRouter();
  const [loadedState, setLoadedState] = useState('loading' as LoadedState);

  const loadStats = async () => {
    await Promise.all(
      [user!.nflPicks!, user!.ncaaPicks!].map((trio) => {
        return Promise.all(
          trio.getTeams().map(async (team) => {
            const stats = await getTeamStats(team.info.id);
            if (stats) {
              team.stats = stats;
            } else throw new Error('Unable to load team stats');
          })
        );
      })
    );
    setDataLoaded(true);
  };

  useFocusEffect(
    useCallback(() => {
      if (!user!.nflPicks || !user!.ncaaPicks) {
        fetch('/user/picks', { method: 'GET', headers: { token: userToken! } })
          .then((res) => {
            res.json().then(async (data) => {
              if (data.season === getSeason()) {
                const picks: { league: League; teams: number[] }[] = data.picks;
                Promise.all(
                  picks.map((pick) =>
                    createTrio(pick).then((trio) => {
                      if (trio) setLeaguePicks(pick.league, trio);
                      else throw 'Unable to load teams';
                    })
                  )
                ).then(() => {
                  if (user!.picksFinalized) {
                    loadStats()
                      .then(() => router.navigate('/home'))
                      .catch((error) => {
                        console.error(error);
                        setLoadedState('error');
                      });
                  } else {
                    router.navigate('/launchpad');
                  }
                });
              } else {
                const leagues: League[] = ['NFL', 'NCAA'] as const;
                leagues.forEach((league: League) => setLeaguePicks(league, new TeamTrio(league)));
              }
            });
          })
          .catch((err) => {
            console.error(err);
            setLoadedState('error');
          });
      } else {
        loadStats()
          .then(() => router.navigate('/home'))
          .catch((error) => {
            console.error(error);
            setLoadedState('error');
          });
      }
    }, [])
  );

  return (
    <ThemedView style={[styles.container]} safe={true}>
      <ThemedText type="title" style={{ color: Theme.main, marginTop: 'auto' }}>
        Future Football
      </ThemedText>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 'auto', marginBottom: 10 }}>
        {loadedState === 'error' && (
          <>
            <MaterialIcons name="error-outline" size={20} color={Theme.error} style={{ marginRight: 6 }} />
            <ThemedText type="defaultSemiBold" style={{ color: Theme.error }}>
              Error Loading Storage
            </ThemedText>
          </>
        )}
        {loadedState !== 'error' && (
          <>
            <ThemedText type="defaultSemiBold" style={{ color: Theme.sub }}>
              Loading
            </ThemedText>
            <ActivityIndicator style={{ marginLeft: 6 }} color={Theme.main} />
          </>
        )}
      </View>
    </ThemedView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
