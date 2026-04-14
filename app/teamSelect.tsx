import { ThemedText, ThemedView } from "@/components/themed/ThemedComponents";
import Theme from "@/constants/Theme";
import { getTeams, League, Team, TeamInfo } from "@/user/api";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TextInput, View } from "react-native";

const TeamCell = ({ team }: { team: TeamInfo }) => {
  return (
    <View style={styles.team_cell}>
      <View style={{ marginBottom: 2, padding: 4 }}>
        <Image
          style={styles.team_image}
          source={team.logo}
          /*placeholder={{ blurhash }}*/
          contentFit="cover"
          transition={1000}
        />
      </View>
      <ThemedText type="defaultSemiBold">{team.abbreviation}</ThemedText>
    </View>
  );
};

const sortTeams = (teams: Team[]) => {
  return teams.sort((a, b) => {
    if (a.info.abbreviation < b.info.abbreviation) return -1;
    if (a.info.abbreviation > b.info.abbreviation) return 1;
    return 0;
  });
};

const TeamSelect = (league: League) => {
  const [teams, setTeams] = useState(new Array(0) as Team[]);

  useEffect(() => {
    getTeams(league)
      .then((teams) => {
        setTeams(sortTeams(teams));
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <ThemedView
      style={[styles.container, { justifyContent: "flex-start" }]}
      safe={true}
    >
      {/* todo: navigate back */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 8,
          marginTop: 8,
        }}
      >
        <ThemedText type="title">Future Football</ThemedText>
      </View>

      <View
        style={{
          flexDirection: "row",
          backgroundColor: Theme.sub,
          paddingVertical: 8,
          borderRadius: 8,
          width: "90%",
          marginTop: 6,
          paddingHorizontal: 12,
        }}
      >
        <FontAwesome
          name="search"
          size={18}
          color={Theme.subAlt}
          style={{ marginRight: 6 }}
        />
        <TextInput
          placeholder="Search"
          style={{
            color: Theme.subAlt,
            outline: "none",
            fontWeight: "600",
            flexGrow: 1,
          }}
        />
      </View>

      {/* <View style={styles.container}>
        {teams.map((team, index) => (
          <TeamRow team={team.info} key={"team-row-" + index} />
        ))}
      </View> */}

      <FlatList
        data={teams}
        /*renderItem={({ item }) => <TeamRow team={item.info} />}*/
        renderItem={({ item }) => <TeamCell team={item.info} />}
        numColumns={4}
        key="team-list-4"
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
        // ItemSeparatorComponent={() => (
        //   <View style={{ flex: 1, flexDirection: "row" }} />
        // )}
      />
    </ThemedView>
  );
};

export default TeamSelect;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  team_cell: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: Theme.main,
    borderRadius: 10,
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 4,
    marginHorizontal: 4,
  },
  team_image: {
    width: 50,
    height: 50,
    //backgroundColor: "#0553",
    //backgroundColor: Theme.main,
    //borderRadius: 25,
  },
});
