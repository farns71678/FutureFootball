import { File } from 'expo-file-system';
import { Platform } from 'react-native';
import { getTeam, isLeague, League } from './api';
import { TeamTrio } from './teamTrio';

const storagePath = './trios.json';

const nflTrio: TeamTrio = new TeamTrio('NFL');
const ncaaTrio: TeamTrio = new TeamTrio('NCAA');

const leagueTrios = [nflTrio, ncaaTrio] as const;

let finalized = false;

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

/*
file structure:
{
  trios: [
    { 
      league: League,
      teams: number[] (team ids)
    }
  ]
  finalized: boolean
}
*/

const parseStorageData = async (file: string) => {
  try {
    const data = JSON.parse(file);
    if (!Array.isArray(data.trios)) return;

    await Promise.all(
      data.trios.map((trio: any) => {
        if (isLeague(trio.league) && Array.isArray(trio.teams)) parseTrio(trio.teams, trio.league);
      })
    );

    if (data.finalized && leagueTrios.every((trio) => trio.size() === TeamTrio.maxTeams)) {
      finalized = true;
    }
  } catch (err) {
    console.error(`Unable to parse storage data: ${err}`);
  }
};

const loadStorageData = async (): Promise<boolean> => {
  try {
    if (Platform.OS !== 'web') {
      // on mobile device
      const triosFile = new File(storagePath);
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
        console.log('loaded data');
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

const formatStorageData = () => {
  const data: any = {};
  leagueTrios.forEach((trio) => {
    data[trio.league] = trio.getTeams().map((team) => team.info.id);
  });
  return data;
};

const saveStorageData = () => {
  try {
    if (Platform.OS !== 'web') {
      const file = new File(storagePath);
      if (!file.exists) file.create();
      file.write(JSON.stringify(formatStorageData()));
    } else {
      // well, this doesn't work
    }
  } catch (err) {
    console.error(err);
  }
};

const saveData = saveStorageData;

const isFinalized = async () => {
  await loadedState;
  return finalized;
};

//nflTrio.addTeam({ info: {id: 0, name: "Seahawks", displayName: "Seattle Seahawks", abbreviation: "SHK", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sea.png", league: "NFL"} });

const getTrios = async () => {
  await loadedState;
  return leagueTrios;
};

export { getTrios, isFinalized, leagueTrios, saveData };

