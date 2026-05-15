export type League = 'NFL' | 'NCAA';

export const isLeague = (data: any): data is League => {
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

export const isStatRound = (data: any): data is StatRound => {
  return data === 'regular-season' || data === 'post-season' || data === 'preseason';
};

export type TeamStat = {
  total: Stat;
  home: Stat;
  away: Stat;
  leagueName: League;
  round: StatRound;
};

export const isTeamStat = (data: any): data is TeamStat => {
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

export const isTeamInfo = (data: any): data is TeamInfo => {
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
  stats: TeamStat[];
};

export type MatchState = {
  period: number;
  clock: number;
  description: string;
  score: any;
  report: string;
};

export const isMatchState = (data: any): data is MatchState => {
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

export const isMatch = (data: any): data is Match => {
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
