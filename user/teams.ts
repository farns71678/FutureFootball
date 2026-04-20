import { TeamTrio } from "./teamTrio";

const nflTrio: TeamTrio = new TeamTrio("NFL");
const ncaaTrio: TeamTrio = new TeamTrio("NCAA");

nflTrio.addTeam({ info: {id: 0, name: "Seahawks", displayName: "Seattle Seahawks", abbreviation: "SHK", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sea.png", league: "NFL"} });

const leagueTrios = [nflTrio, ncaaTrio] as const;

export { leagueTrios, ncaaTrio, nflTrio };

