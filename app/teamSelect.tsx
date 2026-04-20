import { ThemedText, ThemedView } from "@/components/themed/ThemedComponents";
import Theme from "@/constants/Theme";
import { getTeams, League, Team } from "@/user/api";
import { leagueTrios } from "@/user/teams";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import ThemedModal from "./modal";

// todo: goto https://docs.expo.dev/tutorial/create-a-modal/

const TeamCell = ({ team, onPress }: { team: Team; onPress: () => void }) => {
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
        onPress();
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

const TeamSelect = () => {
  const [searchText, setSearchText] = useState("");
  const [teams, setTeams] = useState([] as Team[]);
  const [filteredTeams, setFilteredTeams] = useState(new Array(0) as Team[]);
  const [selectedTeam, setSelectedTeam] = useState(null as Team | null);
  const router = useRouter();

  const { league }: { league: League } = useLocalSearchParams();
  const trio = leagueTrios.find((trio) => trio.league === league);

  const [trioTeams, setTrioTeams] = useState(trio?.getTeams() || []);

  const onAddModalClose = () => {
    setSelectedTeam(null);
  };

  const sortTeams = (teams: Team[]): Team[] => {
    return teams.toSorted((a, b) => {
      if (a.info.abbreviation < b.info.abbreviation) return -1;
      if (a.info.abbreviation > b.info.abbreviation) return 1;
      return 0;
    });
  };

  useEffect(() => {
    console.log(league);
    getTeams(league)
      .then((teamsData) => {
        setTeams(sortTeams(teamsData));
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    const text = searchText;
    const words = text.trim().toLowerCase().split(" ");

    if (words.length > 0) {
      setFilteredTeams(
        teams.filter((team) =>
          trioTeams
            ? trioTeams.every((trioTeam) => trioTeam.info.id !== team.info.id)
            : trioTeams,
        ),
      );
    }

    const filtered: { team: Team; count: number }[] = [];
    teams.forEach((team) => {
      if (!trioTeams.every((trioTeam) => trioTeam.info.id !== team.info.id))
        return;

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
  }, [teams, trioTeams, searchText]);

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
        renderItem={({ item }) => (
          <TeamCell
            team={item}
            onPress={() => {
              setSelectedTeam(item);
            }}
          />
        )}
        numColumns={4}
        key="team-list-4"
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 10 }}
        // ItemSeparatorComponent={() => (
        //   <View style={{ flex: 1, flexDirection: "row" }} />
        // )}
      />

      <ThemedModal
        title="Add Team"
        isVisible={selectedTeam !== null}
        onClose={onAddModalClose}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            width: "100%",
            padding: 10,
          }}
        >
          <View style={{ alignItems: "center", maxWidth: "35%" }}>
            <View
              style={{
                padding: 16,
                backgroundColor: Theme.text,
                borderRadius: "50%",
              }}
            >
              <Image
                style={{ width: 80, height: 80 }}
                source={selectedTeam && selectedTeam.info.logo}
                /*placeholder={{ blurhash }}*/
                contentFit="cover"
                transition={0}
              />
            </View>

            <View
              style={{
                marginTop: 8,
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <ThemedText
                type="defaultSemiBold"
                style={{ textAlign: "center" }}
              >
                {selectedTeam?.info.displayName}
              </ThemedText>
            </View>
          </View>

          <View
            style={[
              styles.container,
              {
                justifyContent: "flex-start",
                marginLeft: 10,
                alignItems: "stretch",
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                width: "100%",
              }}
            >
              <ThemedText>Add Team?</ThemedText>
              <View style={{ flex: 1 }}></View>
              <Pressable
                style={styles.add_btn}
                onPress={() => {
                  if (!selectedTeam) return;
                  console.log("adding " + selectedTeam?.info.displayName);
                  trio?.addTeam(selectedTeam);
                  setTrioTeams(trio?.getTeams() || []);
                }}
              >
                <Text style={styles.add_btn_text}>Add</Text>
                <Entypo name="plus" size={18} color="white" />
              </Pressable>
            </View>

            <View
              style={{ flexGrow: 1, marginTop: 6, flexDirection: "column" }}
            >
              {trio?.getTeams().map((team: Team) => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: Theme.main + "77",
                    borderRadius: 6,
                    padding: "2%",
                    width: "100%",
                    flexGrow: 1,
                    maxHeight: "50%",
                  }}
                >
                  <View
                    style={{
                      borderRadius: "50%",
                      height: "100%",
                      backgroundColor: Theme.main,
                      padding: "1%",
                      marginRight: 6,
                    }}
                  >
                    <Image
                      style={{ height: "100%", aspectRatio: 1 }}
                      source={team.info.logo}
                      transition={0}
                      contentFit="cover"
                    />
                  </View>
                  <ThemedText type="defaultSemiBold">
                    {team.info.displayName}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ThemedModal>
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
  add_btn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: Theme.error,
  },
  add_btn_text: {
    color: "white",
    fontWeight: "700",
  },
});
