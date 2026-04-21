import { ThemedText, ThemedView } from "@/components/themed/ThemedComponents";
import Theme from "@/constants/Theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Modal, Pressable, StyleSheet, View, ViewProps } from "react-native";

export type ThemedModal = ViewProps & {
  title: string;
  isVisible: boolean;
  onClose: () => void;
};

const ThemedModal = ({ title, isVisible, children, onClose }: ThemedModal) => {
  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={isVisible}>
        <ThemedView style={styles.modalContent}>
          <View style={styles.titleContainer}>
            <ThemedText type="defaultSemiBold">{title}</ThemedText>
            <Pressable onPress={onClose}>
              <MaterialIcons
                name="close"
                color="#fff"
                size={22}
              ></MaterialIcons>
            </Pressable>
          </View>
          <View style={styles.container}>{children}</View>
        </ThemedView>
      </Modal>
    </View>
  );
};

export default ThemedModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    height: "30%",
    width: "100%",
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: "absolute",
    bottom: 0,
  },
  titleContainer: {
    height: "16%",
    backgroundColor: Theme.subAlt,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
