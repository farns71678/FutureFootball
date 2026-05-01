import { File } from 'expo-file-system';
import { Platform } from 'react-native';
import { getTeam, isLeague, League } from './api';
import { storageTestData } from './storage-test';
import { TeamTrio } from './teamTrio';

const storagePath = './trios.json';

const nflTrio: TeamTrio = new TeamTrio('NFL');
const ncaaTrio: TeamTrio = new TeamTrio('NCAA');

const leagueTrios = [nflTrio, ncaaTrio] as const;

let finalized = false;

const parseTrio = async (data: number[], league: League) => {
  return Promise.all(
    leagueTrios.map((trio) => {
      if (trio.league === league) {
        return Promise.all(
          data.map((teamId) =>
            getTeam(teamId).then((team) => {
              console.log('resolved 1');
              if (team) {
                trio.addTeam(team);
              } else {
                throw 'Unable to get team';
              }
            })
          )
        ).then(() => console.log('resolved 2'));
      }
    })
  ).then(() => console.log('resolved 3'));
};

/*
file structure:
{
  trios: [
    { 
      league: League,
      teams: number[] (team ids)
    }
  ],
  finalized: boolean
}
*/

const parseStorageData = async (file: string) => {
  try {
    const data = JSON.parse(file);
    if (!Array.isArray(data.trios)) {
      console.error('data.trios is not an array');
      return;
    }

    await Promise.all(
      data.trios.map((trio: any) => {
        if (isLeague(trio.league) && Array.isArray(trio.teams)) {
          return parseTrio(
            trio.teams.filter((teamId: any) => !isNaN(teamId)),
            trio.league
          ).then(() => console.log('resolved 4'));
        } else {
          console.error('trio is not valid trio');
        }
      })
    ).then(() => console.log('resolved 5'));

    if (data.finalized && leagueTrios.every((trio) => trio.size() === TeamTrio.maxTeams)) {
      finalized = true;
    }
    console.log('parsed');
    return true;
  } catch (err) {
    console.error(`Unable to parse storage data: ${err}`);
  }
  return false;
};

const loadStorageData = async (): Promise<boolean> => {
  try {
    if (Platform.OS !== 'web') {
      // on mobile device
      const triosFile = new File(storagePath);
      if (triosFile.exists) {
        if (await parseStorageData(triosFile.textSync())) {
          // console.log(leagueTrios);
          return true;
        } else return false;
      } else {
        console.log('No teams saved');
      }
    } else {
      // test with dummy file
      //const data = await Asset.loadAsync(require('@/assets/storage-test.json'));
      if (await parseStorageData(storageTestData)) {
        // console.log(leagueTrios);
        console.log('loaded data');
        return true;
      } else return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
  return false;
};

const loadedState = loadStorageData();

const formatStorageData = (finalized: boolean) => {
  const data: any = { finalized };
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
      file.write(JSON.stringify(formatStorageData(finalized)));
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

const isLoaded = async () => {
  return await loadedState;
};

//nflTrio.addTeam({ info: {id: 0, name: "Seahawks", displayName: "Seattle Seahawks", abbreviation: "SHK", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sea.png", league: "NFL"} });

const getTrios = async () => {
  await loadedState;
  return leagueTrios;
};

export { getTrios, isFinalized, isLoaded, leagueTrios, saveData };

