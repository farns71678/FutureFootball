import { File } from 'expo-file-system';
import { Platform } from 'react-native';
import { getTeam, isLeague, League } from './api';
import { TeamTrio } from './teamTrio';

const nflTrio: TeamTrio = new TeamTrio('NFL');
const ncaaTrio: TeamTrio = new TeamTrio('NCAA');

const leagueTrios = [nflTrio, ncaaTrio] as const;

const parseTrio = async (data: any, league: League) => {
  if (!Array.isArray(data)) return;

  await Promise.all(
    leagueTrios.map(async (trio) => {
      if (trio.league === league) {
        const teams = await Promise.all(data.map((teamId) => (isNaN(teamId) ? null : getTeam(teamId))));
        teams.forEach((team) => {
          if (team) trio.addTeam(team);
        });
      }
    })
  );
};

const parseStorageData = async (file: string) => {
  try {
    const data = JSON.parse(file);
    await Promise.all(
      Object.keys(data).map((key) => {
        if (isLeague(key)) parseTrio(data.key, key);
      })
    );
  } catch (err) {
    console.error(`Unable to parse storage data: ${err}`);
  }
};

const loadStorageData = async (): Promise<boolean> => {
  try {
    if (Platform.OS !== 'web') {
      // on mobile device
      const triosFile = new File('./trios.json');
      if (triosFile.exists) {
        parseStorageData(triosFile.textSync());
        return true;
      } else {
        console.log('No teams saved');
      }
    } else {
      // test with dummy file
      const res = await fetch('./assets/storage-test.json');

      if (res.ok) {
        parseStorageData(await res.text());
        return true;
      } else {
        console.error('Couldnt load storage file');
        return false;
      }
    }
  } catch (err) {
    console.error(err);
    return false;
  }
  return false;
};

const loadedState = loadStorageData();

//nflTrio.addTeam({ info: {id: 0, name: "Seahawks", displayName: "Seattle Seahawks", abbreviation: "SHK", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sea.png", league: "NFL"} });

const getTrios = async () => {
  await loadedState;
  return leagueTrios;
};

export { getTrios };

