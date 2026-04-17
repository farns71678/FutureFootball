import { ThemedText, ThemedView } from "@/components/themed/ThemedComponents";
import Theme from "@/constants/Theme";
import { getTeams, League, Team } from "@/user/api";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";

// todo: goto https://docs.expo.dev/tutorial/create-a-modal/

const TeamCell = ({ team }: { team: Team }) => {
  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => {
        return pressed
          ? [
              styles.team_cell,
              { backgroundColor: styles.team_cell.backgroundColor + "bb" },
            ]
          : styles.team_cell;
      }}
      onPress={() => {
        console.log("pressed " + team.info.displayName);
        // const teamStr = JSON.stringify(team);
        // console.log(teamStr);
        // router.push({
        //   pathname: "/teamAddModal",
        //   params: { team: teamStr },
        // });
      }}
    >
      <View style={{ marginBottom: 2, padding: 4 }}>
        <Image
          style={styles.team_image}
          source={team.info.logo}
          /*placeholder={{ blurhash }}*/
          contentFit="cover"
          transition={0}
        />
      </View>
      <ThemedText type="defaultSemiBold">{team.info.abbreviation}</ThemedText>
    </Pressable>
  );
};

const sortTeams = (teams: Team[]) => {
  return teams.sort((a, b) => {
    if (a.info.abbreviation < b.info.abbreviation) return -1;
    if (a.info.abbreviation > b.info.abbreviation) return 1;
    return 0;
  });
};

const TeamSelect = () => {
  const [searchText, setSearchText] = useState("");
  const [teams, setTeams] = useState(new Array(0) as Team[]);
  const [filteredTeams, setFilteredTeams] = useState(new Array(0) as Team[]);
  const router = useRouter();

  const { league }: { league: League } = useLocalSearchParams();

  useEffect(() => {
    console.log(league);
    getTeams(league)
      .then((teams) => {
        setTeams(sortTeams(teams));
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    const text = searchText;
    const words = text.trim().toLowerCase().split(" ");

    if (words.length > 0) {
      setFilteredTeams(teams);
    }

    const filtered: { team: Team; count: number }[] = [];
    teams.forEach((team) => {
      const info = team.info;
      const name = info.displayName.toLowerCase();
      const abbr = info.abbreviation.toLowerCase();
      // let count = 0;
      // words.forEach((word) => {
      //   if (name.includes(word)) {
      //     count++;
      //     if (name.indexOf(word)) count++;
      //   }
      //   if (word === abbr) count++;
      // });

      // if (count > 0) filtered.push({ team, count });

      if (
        words.every((word) => name.includes(word)) ||
        words.some((word) => abbr === word)
      ) {
        filtered.push({ team, count: 1 });
      }
    });

    filtered.sort((a, b) => a.count - b.count);

    setFilteredTeams(filtered.map((filteredTeam) => filteredTeam.team));
  }, [teams, searchText]);

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
          width: "100%",
          paddingHorizontal: 12,
        }}
      >
        <Pressable
          style={({ pressed }) => [
            { borderRadius: "50%", marginRight: "auto", marginTop: 3 },
            pressed && { backgroundColor: Theme.subAlt },
          ]}
          onPress={() => {
            router.back();
          }}
        >
          <Entypo name="chevron-left" size={26} color={Theme.text} />
        </Pressable>
        <ThemedText type="title" style={{ marginRight: "auto" }}>
          Future Football
        </ThemedText>
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
          marginBottom: 4,
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
          onChangeText={(text) => {
            setSearchText(text);
          }}
        />
      </View>

      {/* <View style={styles.container}>
        {teams.map((team, index) => (
          <TeamRow team={team.info} key={"team-row-" + index} />
        ))}
      </View> */}

      <FlatList
        data={filteredTeams}
        /*renderItem={({ item }) => <TeamRow team={item.info} />}*/
        renderItem={({ item }) => <TeamCell team={item} />}
        numColumns={4}
        key="team-list-4"
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 10 }}
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
