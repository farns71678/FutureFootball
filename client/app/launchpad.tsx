import TeamTrioList from '@/components/TeamTrioList';
import { ThemedText, ThemedView } from '@/components/themed/ThemedComponents';
import Theme from '@/constants/Theme';
import { TeamTrio } from '@/user/teamTrio';
import { useAuthStore } from '@/utils/authStore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

export default function Launchpad() {
  const { user, userToken, setLeaguePicks, finalizeTeams } = useAuthStore();

  const checkFilledTeams = () => {
    return user && [user.nflPicks, user.ncaaPicks].every((trio) => trio && trio.size() === TeamTrio.maxTeams);
  };

  const [filledTeams, setFilledTeams] = useState(checkFilledTeams());

  const [finalizingState, setFinalizingState] = useState(false);
  const [finalizingError, setFinalizingError] = useState('');

  useFocusEffect(
    useCallback(() => {
      setFilledTeams(checkFilledTeams());
    }, [])
  );

  const onTeamTrioChanged = (trio: TeamTrio) => {
    setLeaguePicks(trio.league, trio);
    setFilledTeams(checkFilledTeams());
  };

  return (
    <ThemedView type="container" style={[styles.container, { alignItems: 'stretch' }]} safe={true}>
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

        <View style={[{ padding: 12, flexDirection: 'row', justifyContent: 'center' }]}>
          <Ionicons name="american-football-sharp" size={184} color={Theme.sub} />
        </View>

        {/* <ThemedText style={{color: "#ffffff"}}>Edit app/index.tsx to edit this screen.</ThemedText> */}
        {[user?.ncaaPicks, user?.nflPicks].map((trio, index) => (
          <View key={'trio-container-' + index}>
            {trio ? (
              <>
                <TeamTrioList trio={trio} onChange={() => onTeamTrioChanged(trio)} />
                <View style={{ paddingTop: 16 }} />
              </>
            ) : (
              <View style={{ flexDirection: 'row' }}>
                <ActivityIndicator color="white" style={{ marginRight: 6 }} /> Loading
              </View>
            )}
          </View>
        ))}

        <View style={{ flexGrow: 1 }} />

        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {filledTeams ? (
            <>
              <Pressable
                style={({ pressed }) =>
                  pressed
                    ? [styles.confirm_btn, { backgroundColor: styles.confirm_btn.backgroundColor + 'bb' }]
                    : styles.confirm_btn
                }
                disabled={!finalizingState}
                onPress={async () => {
                  setFinalizingState(true);
                  setFinalizingError('');

                  try {
                    const res = await fetch('/user/finalizePicks', { method: 'GET', headers: { token: userToken! } });

                    if (res.ok) {
                      finalizeTeams();
                      router.navigate('/');
                    } else {
                      const data = await res.json();
                      setFinalizingState(false);
                      setFinalizingError(data.message || 'Error finalizing teams');
                    }
                  } catch (error) {
                    console.error(error);
                    setFinalizingState(false);
                    setFinalizingError('Error finalizing teams');
                  }
                }}
              >
                {!finalizingState ? (
                  <ThemedText type="defaultSemiBold" style={{ fontSize: 20 }}>
                    Confirm Selection
                  </ThemedText>
                ) : (
                  <View style={{ flexDirection: 'row' }}>
                    <ActivityIndicator color="white" style={{ marginRight: 6 }} />
                    <ThemedText type="defaultSemiBold" style={{ fontSize: 20 }}>
                      Loading
                    </ThemedText>
                  </View>
                )}
              </Pressable>
              {finalizingError && <ThemedText type="error">{finalizingError}</ThemedText>}
            </>
          ) : (
            <ThemedText>Add up to three teams</ThemedText>
          )}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirm_btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: 'white',
    backgroundColor: Theme.main,
    borderRadius: 8,
    fontFamily: 'Arial',
  },
});
