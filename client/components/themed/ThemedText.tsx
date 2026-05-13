import Theme from "@/constants/Theme";
import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";

export type ThemedTextPrompts = TextProps & {
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

const ThemedText = ({
  style,
  type = "default",
  ...props
}: ThemedTextPrompts) => {
  return (
    <Text
      style={[
        { color: Theme.text },
        type == "default" ? styles.default : undefined,
        type == "title" ? styles.title : undefined,
        type == "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type == "subtitle" ? styles.subtitle : undefined,
        type == "link" ? styles.link : undefined,
        style,
      ]}
      {...props}
    />
  );
};

export default ThemedText;

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: Theme.main,
  },
});
