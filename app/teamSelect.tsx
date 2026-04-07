import { ThemedText, ThemedView } from "@/components/themed/ThemedComponents";
import React from "react";
import { StyleSheet, View } from "react-native";

const TeamSelect = () => {
  return (
    <ThemedView style={[styles.container, { justifyContent: "flex-start" }]}>
      {/* todo: navigate back */}
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
});
