import Theme from "@/constants/Theme";
import React from "react";
import { View, ViewProps } from "react-native";

const ThemedView = ({ style, ...props }: ViewProps) => {
  return <View style={[{ backgroundColor: Theme.bg }, style]} />;
};

export default ThemedView;
