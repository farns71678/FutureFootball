import { File } from 'expo-file-system';
import { TeamTrio } from './teamTrio';

const nflTrio: TeamTrio = new TeamTrio('NFL');
const ncaaTrio: TeamTrio = new TeamTrio('NCAA');

try {
  const triosFile = new File('./trios.json');
  if (triosFile.exists) {
    console.log(triosFile.textSync());
  } else {
    console.log('No teams saved');
  }
} catch (err) {
  console.error(err);
}

//nflTrio.addTeam({ info: {id: 0, name: "Seahawks", displayName: "Seattle Seahawks", abbreviation: "SHK", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sea.png", league: "NFL"} });

const leagueTrios = [nflTrio, ncaaTrio] as const;

export { leagueTrios, ncaaTrio, nflTrio };

