import TeamTrioList from '@/components/TeamTrioList';
import { ThemedText, ThemedView } from '@/components/themed/ThemedComponents';
import Theme from '@/constants/Theme';
import { getTrios } from '@/user/teams';
import { TeamTrio } from '@/user/teamTrio';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

export default function Index() {
  const [leagueTrios, setLeagueTrios] = useState(null as TeamTrio[] | null);

  const checkFilledTeams = () => {
    return leagueTrios && leagueTrios.every((trio) => trio.size() === TeamTrio.maxTeams);
  };

  const [filledTeams, setFilledTeams] = useState(checkFilledTeams());

  useFocusEffect(
    useCallback(() => {
      setFilledTeams(checkFilledTeams());
    }, [])
  );

  useEffect(() => {
    getTrios().then((trios) => setLeagueTrios([...trios]));
  }, []);

  const onTeamTrioChanged = () => {
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
        {leagueTrios ? (
          leagueTrios.map((trio, index) => (
            <View key={'trio-container-' + index}>
              <TeamTrioList trio={trio} onChange={onTeamTrioChanged} />
              <View style={{ paddingTop: 16 }} />
            </View>
          ))
        ) : (
          <View>
            <ThemedText>Loading</ThemedText>
            <ActivityIndicator style={{ marginLeft: 6 }} />
          </View>
        )}

        <View style={{ flexGrow: 1 }} />

        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {filledTeams ? (
            <Pressable
              style={({ pressed }) =>
                pressed
                  ? [styles.confirm_btn, { backgroundColor: styles.confirm_btn.backgroundColor + 'bb' }]
                  : styles.confirm_btn
              }
              onPress={() => {
                console.log('confirming teams');
              }}
            >
              <ThemedText type="defaultSemiBold" style={{ fontSize: 20 }}>
                Confirm Selection
              </ThemedText>
            </Pressable>
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
