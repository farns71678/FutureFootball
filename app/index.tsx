import { ThemedText, ThemedView } from '@/components/themed/ThemedComponents';
import Theme from '@/constants/Theme';
import { getTeamStats } from '@/user/api';
import { isFinalized, isLoaded, leagueTrios } from '@/user/teams';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

type LoadedState = 'loading' | 'loaded' | 'error' | 'finalized';

const index = () => {
  const router = useRouter();
  const [loadedState, setLoadedState] = useState('loading' as LoadedState);

  useEffect(() => {
    // load file data
    isLoaded().then((loaded) => {
      setLoadedState(loaded ? 'loaded' : 'error');

      isFinalized().then(async (finalized) => {
        if (finalized) {
          setLoadedState('finalized');
          Promise.all(
            leagueTrios.map((trio) => {
              return Promise.all(
                trio.teams.map((team) => {
                  // todo: wait for team stats
                  return getTeamStats(team.info.id);
                })
              );
            })
          )
            .then(() => {
              router.navigate('/home');
            })
            .catch((err) => {
              console.error(`Couldn't load team stats: ${err}`);
              setLoadedState('error');
            });
        }
        if (loaded) router.navigate('/launchpad');
      });
    });
  }, []);

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
