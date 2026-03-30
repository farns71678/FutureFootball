import TeamTrioList from "@/components/TeamTrioList";
import { ThemedText, ThemedView } from "@/components/ThemedComponents";
import { leagueTrios } from "@/user/teams";

export default function Index() {
  return (
    <ThemedView
      type="container"
      style={{
        flex: 1,
      }}
    >
      <ThemedText
        type="title"
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Future Football
      </ThemedText>
      {/* <ThemedText style={{color: "#ffffff"}}>Edit app/index.tsx to edit this screen.</ThemedText> */}
      {leagueTrios.map((trio) => (
        <TeamTrioList trio={trio} />
      ))}
    </ThemedView>
  );
}
