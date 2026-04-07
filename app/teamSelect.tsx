import { ThemedText, ThemedView } from "@/components/themed/ThemedComponents";
import Theme from "@/constants/Theme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

const TeamSelect = () => {
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
