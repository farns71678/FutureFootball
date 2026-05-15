import NodeCache from 'node-cache';
import config from '../config/config.js';
import {
  isLeague,
  isTeamInfo,
  isTeamStat,
  type League,
  type Match,
  type Team,
  type TeamInfo,
  type TeamStat,
} from './api-types.js';

const apiCache = new NodeCache();

/**
 * Returns time until midnight in milliseconds (when cache clears)
 */
const getTTL = (): number => {
  return 24 * 60 * 60 * 1000 - new Date(Date.now()).getMilliseconds();
};

const fetchAPIData = async (url: string) => {
  if (apiCache.has(url)) return apiCache.get(url);

  //if (fetchMap.has(url)) reu
  const apiHeaders = {
    'x-rapidapi-host': config.apiHost ?? '',
    'x-rapidapi-key': config.apiKey ?? '',
  };

  console.log(`Fetching: ${config.apiUrl + url}`);
  const res = await fetch(config.apiUrl + url, { method: 'GET', headers: apiHeaders });

  if (!res.ok) {
    console.error(`Unable to fetch ${url}`);
    res.text().then(text => console.error(text));
    return null;
  }
  const data = await res.json();
  apiCache.set(url, data, getTTL());
  return data;
};

/**
 * Get teams from api
 */
const getTeams = async (league: League): Promise<TeamInfo[] | null> => {
  const url = `teams?league=${league}`;
  const data = await fetchAPIData(url);

  if (Array.isArray(data) && data.length > 0 && data.every((team) => isTeamInfo(team))) {
    return data as TeamInfo[];
  }

  return null;
};

/**
 * Gets team info from api
 * @param id team id
 */
const getTeamInfo = async (id: number): Promise<TeamInfo | null> => {
  const url = 'teams/' + id;
  const data = await fetchAPIData(url);

  if (Array.isArray(data) && data[0] && isTeamInfo(data[0])) {
    return data[0] as TeamInfo;
  }

  return null;
};


const getSeason = () => {
  const date = new Date();
  return date.getFullYear() - (date.getMonth() > 5 ? 0 : 1);
}

const getSeasonDate = (year: number | undefined = undefined) => {
  if (!year) year = getSeason();
  return year + '-07-01';
};

/**
 * Get team stats from api
 * @param id team id
 */
const getTeamStats = async (id: number, season: number | undefined = undefined): Promise<TeamStat[] | null> => {
  const url = `teams/statistics/${id}?fromDate=${getSeasonDate(season)}`;
  const data = await fetchAPIData(url);

  if (Array.isArray(data) && data.every((stat) => isTeamStat(stat))) {
    const stats = data as TeamStat[];
    return stats;
  }
  else console.log(JSON.stringify(data));

  return null;
};

/**
 * Get team information and stats from api
 * @param id team id
 */
const getTeam = async (id: number, season: number | undefined = undefined): Promise<Team | null> => {
  // team is made up of both stats and info
  const teamData = await Promise.all([getTeamInfo(id), getTeamStats(id, season)]);

  if (teamData[0] && teamData[1]) {
    const team = { info: teamData[0], stats: teamData[1] } as Team;
    return team;
  }

  return null;
};

const matches: Match[] = [];

const getMatchData = async () => {
  const url = 'matches';
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

