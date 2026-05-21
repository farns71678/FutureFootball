import { ThemedText, ThemedView } from '@/components/themed/ThemedComponents';
import Theme from '@/constants/Theme';
import Auth from '@/user/auth';
import User from '@/user/user';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

type LoadedState = 'loading' | 'loaded' | 'error' | 'finalized';

const index = () => {
  const router = useRouter();
  const [loadedState, setLoadedState] = useState('loading' as LoadedState);

  useFocusEffect(
    useCallback(async () => {
      const loggedIn = await Auth.login();

      if (loggedIn) {
        if (User.picksFinalized()) router.navigate('/home');
        else router.navigate('/launchpad');
      } else {
        router.navigate('/(auth)/login');
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
