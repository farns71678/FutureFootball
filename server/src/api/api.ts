import NodeCache from 'node-cache';
import {
  isLeague,
  isTeamInfo,
  isTeamStat,
  type League,
  type Match,
  type Team,
  type TeamInfo,
  type TeamStat,
} from './api_types.js';

const apiCache = new NodeCache();

/**
 * Returns time until midnight in milliseconds (when cache clears)
 */
const getTTL = (): number => {
  return 24 * 60 * 60 * 1000 - new Date(Date.now()).getMilliseconds();
};

// todo: maybe cache responses
const fetchAPIData = async (url: string) => {
  if (apiCache.has(url)) return apiCache.get(url);

  //if (fetchMap.has(url)) reu
  const apiHeaders = {
    'x-rapidapi-host': process.env.EXPO_PUBLIC_API_HOST ?? '',
    'x-rapidapi-key': process.env.EXPO_PUBLIC_API_KEY ?? '',
  };

  const res = await fetch(process.env.EXPO_PUBLIC_API_URL + url, { method: 'GET', headers: apiHeaders });

  if (!res.ok) {
    console.error(`Unable to fetch ${url}`);
    return null;
  }
  const data = await res.json();
  apiCache.set(url, data, getTTL());
};

/**
 * Get teams from api
 */
const getTeams = async (league: League): Promise<TeamInfo[] | null> => {
  const url = 'teams';
  const data = await fetchAPIData(url);

  if (Array.isArray(data) && data.every((team) => isTeamInfo(team))) {
    return data as TeamInfo[];
  }

  return null;
};

/**
 * Gets team info from api
 * @param id team id
 */
const getTeamInfo = async (id: number): Promise<TeamInfo | null> => {
  const url = 'team/' + id;
  const data = await fetchAPIData(url);

  if (Array.isArray(data) && data[0] && isTeamInfo(data[0])) {
    return data[0] as TeamInfo;
  }

  return null;
};

/**
 * Get team stats from api
 * @param id team id
 */
const getTeamStats = async (id: number): Promise<TeamStat[] | null> => {
  const url = '/teams/statistics?id=' + id;
  const data = await fetchAPIData(url);

  if (Array.isArray(data) && data.every((stat) => isTeamStat(stat))) {
    const stats = data as TeamStat[];
    return stats;
  }

  return null;
};

/**
 * Get team information and stats from api
 * @param id team id
 */
const getTeam = async (id: number): Promise<Team | null> => {
  // team is made up of both stats and info
  const teamData = await Promise.all([getTeamInfo(id), getTeamStats(id)]);

  if (teamData[0] && teamData[1]) {
    const team = { info: teamData[0], stats: teamData[1] } as Team;
    return team;
  }

  return null;
};

const matches: Match[] = [];

const getMatchData = async () => {
  const url = '/matches';
  const data = fetchAPIData(url);
  // todo: finish fleshing out the /matches api endpoint
};

/**
 * Get team matches from api
 * @param id team id
 */
const getTeamMatches = async (id: number) => {
  // todo: implement team match data
};

export { getTeam, getTeamInfo, getTeams, getTeamStats, isLeague };

