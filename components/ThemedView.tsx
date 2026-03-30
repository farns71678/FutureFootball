import Theme from "@/constants/Theme";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  type?: "default" | "container";
};

const ThemedView = ({ style, type = "default", ...props }: ThemedViewProps) => {
  return (
    <View
      style={[
        { backgroundColor: Theme.bg },
        type == "container" ? styles.container : undefined,
        style,
      ]}
      {...props}
    />
  );
};

export default ThemedView;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
});
