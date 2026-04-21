import Theme from "@/constants/Theme";
import { TeamTrio } from "@/user/teamTrio";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, View } from "react-native";
import TeamRow from "./TeamRow";
import ThemedText from "./themed/ThemedText";

type TeamTrioListProps = {
  trio: TeamTrio;
};

const TeamTrioList = ({ trio }: TeamTrioListProps) => {
  const router = useRouter();

  const [teams, setTeams] = useState([...trio.getTeams()]);

  useFocusEffect(
    useCallback(() => {
      setTeams([...trio.getTeams()]);
    }, []),
  );

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 4 }}>
        <ThemedText type={"subtitle"}>{trio.league} Teams</ThemedText>
        <Pressable
          style={({ pressed }) => [
            { marginTop: 6, marginLeft: 6, borderRadius: "50%" },
            pressed && { backgroundColor: Theme.subAlt },
          ]}
          onPress={() =>
            router.push({
              pathname: "/teamSelect",
              params: { league: trio.league },
            })
          }
        >
          <Entypo name="chevron-right" size={22} color={Theme.sub} />
        </Pressable>
      </View>
      {teams.length > 0 ? (
        teams.map((team, index) => {
          return (
            <TeamRow
              team={team.info}
              key={trio.league + "-" + index}
              button={
                <Pressable
                  onPress={() => {
                    trio.removeTeam(team.info.id);
                    setTeams(trio.getTeams());
                  }}
                >
                  {({ pressed }) => (
                    <Ionicons
                      name={pressed ? "remove-circle" : "remove-circle-outline"}
                      size={24}
                      color={Theme.error}
                    />
                  )}
                </Pressable>
              }
            />
          );
        })
      ) : (
        <ThemedText>You have no teams</ThemedText>
      )}
    </View>
  );
};

export default TeamTrioList;
