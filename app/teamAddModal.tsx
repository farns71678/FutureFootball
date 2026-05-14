import { ThemedText, ThemedView } from "@/components/themed/ThemedComponents";
import Theme from "@/constants/Theme";
import { Team } from "@/user/api";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, router } from "expo-router";
import React from "react";
import { Modal, Pressable, StyleSheet, View, ViewProps } from "react-native";

export type TeamAddModalProps = ViewProps & {
  team?: string;
  isVisible: boolean;
  onClose: () => void;
};

const TeamAddModal = ({ team, isVisible, onClose }: TeamAddModalProps) => {
  const isPresented = router.canGoBack();
  console.log(team);
  const data = team
    ? (JSON.parse(team) as Team)
    : { info: { displayName: "" } };

  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={isVisible}>
        <ThemedView style={styles.modalContent}>
          <View style={styles.titleContainer}>
            <ThemedText type="defaultSemiBold">
              Add {data.info.displayName}
            </ThemedText>
            <Pressable onPress={onClose}>
              <MaterialIcons
                name="close"
                color="#fff"
                size={22}
              ></MaterialIcons>
            </Pressable>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Pressable style={styles.btn}>Add Team</Pressable>
            {isPresented && (
              <Link href="../" style={[styles.btn, styles.cancel_btn]}>
                Cancel
              </Link>
            )}
          </View>
        </ThemedView>
      </Modal>
    </View>
  );
};

export default TeamAddModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    height: "25%",
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
