import Theme from "@/constants/Theme";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ThemedViewProps = ViewProps & {
  safe?: boolean;
  type?: "default" | "container";
};

const ThemedView = ({
  style,
  safe = false,
  type = "default",
  ...props
}: ThemedViewProps) => {
  const insets = useSafeAreaInsets();

  if (!safe)
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

  // todo: finish insets
  return (
    <View
      style={[
        { backgroundColor: Theme.bg, paddingTop: insets.top },
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
