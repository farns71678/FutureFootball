import Theme from "@/constants/Theme";
import { TeamInfo } from "@/user/api";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./themed/ThemedComponents";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

interface TeamRowProps {
  team: TeamInfo;
  button?: React.JSX.Element;
}

const TeamRow = ({ team, button }: TeamRowProps) => {
  return (
    <View style={styles.containerSecondary}>
      <View style={{ marginRight: 8 }}>
        <Image
          style={styles.image}
          source={team.logo}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
      </View>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <ThemedText type="defaultSemiBold">{team.displayName}</ThemedText>
      </View>
      {button || <View />}
    </View>
  );
};

export default TeamRow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  containerSecondary: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    //backgroundColor: "#377",
    backgroundColor: Theme.subAlt,
    borderRadius: 10,
  },
  image: {
    width: 50,
    height: 50,
    //backgroundColor: "#0553",
    backgroundColor: Theme.main,
    borderRadius: 25,
  },
});
