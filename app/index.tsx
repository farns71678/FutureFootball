import TeamTrioList from "@/components/TeamTrioList";
import { ThemedText, ThemedView } from "@/components/themed/ThemedComponents";
import Theme from "@/constants/Theme";
import { leagueTrios } from "@/user/teams";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View } from "react-native";

export default function Index() {
  return (
    <ThemedView
      type="container"
      style={{
        flex: 1,
        justifyContent: "flex-start",
        paddingVertical: 10,
        paddingHorizontal: 8,
      }}
      safe={true}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <ThemedText type="title">Future Football</ThemedText>
      </View>

      <View style={[styles.container, { padding: 12 }]}>
        <Ionicons name="american-football-sharp" size={184} color={Theme.sub} />
      </View>

      {/* <ThemedText style={{color: "#ffffff"}}>Edit app/index.tsx to edit this screen.</ThemedText> */}
      {leagueTrios.map((trio) => (
        <>
          <TeamTrioList trio={trio} />
          <View style={{ paddingTop: 10 }} />
        </>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
