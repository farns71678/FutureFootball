import { ThemedText, ThemedView } from "@/components/themed/ThemedComponents";
import Theme from "@/constants/Theme";
import { Team } from "@/user/api";
import { Link, router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

const TeamAddModal = ({ team }: { team: string }) => {
  const isPresented = router.canGoBack();
  console.log(team);
  const data = JSON.parse(team) as Team;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="defaultSemiBold">
        Add {data.info.displayName}
      </ThemedText>
      <View style={{ flexDirection: "row" }}>
        <Pressable style={styles.btn}>Add Team</Pressable>
        {isPresented && (
          <Link href="../" style={[styles.btn, styles.cancel_btn]}>
            Cancel
          </Link>
        )}
      </View>
    </ThemedView>
  );
};

export default TeamAddModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    fontWeight: "600",
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 18,
    borderRadius: 6,
  },
  cancel_btn: {
    color: Theme.bg,
    backgroundColor: Theme.sub,
  },
});
