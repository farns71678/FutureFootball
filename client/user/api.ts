export type League = 'NFL' | 'NCAA';

const isLeague = (data: any): data is League => {
  return data === 'NFL' || data === 'NCAA';
};

export type Stat = {
  games: {
    played: number;
    wins: number;
    loses: number;
  };
  points: {
    scored: number;
    received: number;
  };
};

const isStat = (data: any): data is Stat => {
  return (
    data.games &&
    typeof data.games.played === 'number' &&
    typeof data.games.wins === 'number' &&
    typeof data.games.loses === 'number' &&
    data.points &&
    typeof data.points.scored === 'number' &&
    typeof data.points.received === 'number'
  );
};

export type StatRound = 'regular-season' | 'post-season' | 'preseason';

const isStatRound = (data: any): data is StatRound => {
  return data === 'regular-season' || data === 'post-season' || data === 'preseason';
};

export type TeamStat = {
  total: Stat;
  home: Stat;
  away: Stat;
  leagueName: League;
  round: StatRound;
};

const isTeamStat = (data: any): data is TeamStat => {
  return (
    data &&
    isStat(data.total) &&
    isStat(data.home) &&
    isStat(data.away) &&
    isLeague(data.leagueName) &&
    isStatRound(data.round)
  );
};

export type TeamInfo = {
  id: number;
  logo: string;
  name: string;
  displayName: string;
  abbreviation: string;
  league: League;
};

const isTeamInfo = (data: any): data is TeamInfo => {
  return (
    typeof data.id === 'number' &&
    typeof data.logo === 'string' &&
    typeof data.logo === 'string' &&
    typeof data.name === 'string' &&
    typeof data.displayName === 'string' &&
    isLeague(data.league)
  );
};

export type Team = {
  info: TeamInfo;
  stats?: TeamStat[];
  matches?: [];
};

// todo: separate college and nfl teams
const teams = new Map<number, Team>();

const teamArray = (league?: League): Team[] => {
  return Array.from(teams)
    .map((pair) => pair[1])
    .filter((team) => !league || team.info.league === league);
};

const fetchAPIData = async (url: string) => {
  const res = await fetch(process.env.EXPO_PUBLIC_SERVER_URL + 'api/' + url);

  if (!res.ok) {
    console.error(`Unable to fetch ${url}`);
    return null;
  }
  return await res.json();
};

/**
 * Get teams from api
 */
const getTeams = async (league: League): Promise<Team[]> => {
  if (teams.size > 0) return teamArray(league);

  const url = 'teams';
  const data = await fetchAPIData(url);

  if (Array.isArray(data)) {
    data.forEach((team) => {
      if (isTeamInfo(team)) {
        const info: TeamInfo = team;
        if (!teams.has(info.id)) teams.set(team.id, { info });
      }
    });

    return teamArray(league);
  }

  return [];
};

/**
 * Get team information from api
 * @param id team id
 */
const getTeam = async (id: number): Promise<Team | null> => {
  let team = teams.get(id);
  if (team) return team;

  const url = 'teaminfo/' + id;
  const data = await fetchAPIData(url);
  // console.log(data);

  if (isTeamInfo(data)) {
    const teamInfo: TeamInfo = data;
    team = { info: teamInfo };
    teams.set(id, team);
    console.log(team);
    return team;
  }

  // console.log(`Couln't get team ${id}`)

  return null;
};

const loadTeamInfo = async (id: number): Promise<Team | null> => {
  const team = teams.get(id);
  if (team) {
    await Promise.all([(async () => getTeamStats(team.info.id))()]);
  }

  return null;
};

const getSeason = () => {
  const date = new Date();
  return date.getFullYear() - (date.getMonth() > 5 ? 0 : 1);
};

const getSeasonDate = () => {
  const year = getSeason();
  return year + '-07-01';
};

/**
 * Get team stats from api
 * @param id team id
 */
const getTeamStats = async (id: number): Promise<TeamStat[] | null> => {
  const team = teams.get(id);
  if (team && team.stats) {
    return team.stats;
  } else {
    // figure out date

    const url = 'teamstats/' + id;
    const data = await fetchAPIData(url);

    if (data && Array.isArray(data) && data.every(isTeamStat)) {
      const stats = data as TeamStat[];
      if (team) team.stats = stats;
      return stats;
    }

    return null;
  }
};

export type MatchState = {
  period: number;
  clock: number;
  description: string;
  score: any;
  report: string;
};

const isMatchState = (data: any): data is MatchState => {
  return (
    data &&
    typeof data.period === 'number' &&
    typeof data.clock === 'number' &&
    typeof data.description === 'string' &&
    data.score &&
    typeof data.report === 'string'
  );
};

export type Match = {
  id: number;
  round: string;
  date: Date | string;
  league: League;
  season: number;
  awayTeam: TeamInfo;
  homeTeam: TeamInfo;
  state: MatchState;
};

const isMatch = (data: any): data is Match => {
  return (
    data &&
    typeof data.id === 'number' &&
    typeof data.round === 'string' &&
    (typeof data.date === 'string' || data.date instanceof Date) &&
    isLeague(data.league) &&
    typeof data.season === 'number' &&
    isTeamInfo(data.awayTeam) &&
    isTeamInfo(data.homeTeam) &&
    isMatchState(data.state)
  );
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
  const team = teams.get(id);
  if (team && team.matches) {
    return team.matches;
  } else {
    await getMatchData();
  }
};

export { getSeason, getTeam, getTeams, getTeamStats, isLeague };

