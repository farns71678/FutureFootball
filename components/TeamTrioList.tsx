import { TeamTrio } from "@/user/teamTrio";
import React from "react";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";

type TeamTrioListProps = {
  trio: TeamTrio;
};

const TeamTrioList = ({ trio }: TeamTrioListProps) => {
  return (
    <ThemedView type="container">
      <ThemedText type={"subtitle"}>{trio.name} Teams</ThemedText>
    </ThemedView>
  );
};

export default TeamTrioList;
