export type League = "NFL" | "NCAA";

const isLeague = (data: any): data is League => {
  return data === "NFL" || data === "NCAA";
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
    typeof data.games.played === "number" &&
    typeof data.games.wins === "number" &&
    typeof data.games.loses === "number" &&
    data.points &&
    typeof data.points.scored === "number" &&
    typeof data.points.received === "number"
  );
};

export type TeamStat = {
  total: Stat;
  home: Stat;
  away: Stat;
  leagueName: League;
  round: string;
};

const isTeamStat = (data: any): data is TeamStat => {
  return (
    isStat(data.total) &&
    isStat(data.home) &&
    isStat(data.away) &&
    isLeague(data.league) &&
    typeof data.round === "string"
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
    typeof data.id === "number" &&
    typeof data.logo === "string" &&
    typeof data.logo === "string" &&
    typeof data.name === "string" &&
    typeof data.displayName === "string" &&
    isLeague(data.league)
  );
};

export type Team = {
  info: TeamInfo;
  stats?: TeamStat;
  matches?: [];
};

// todo: separate college and nfl teams
const teams = new Map<number, Team>();

const teamArray = (): Team[] => {
  return Array.from(teams).map((pair) => pair[1]);
};

//const fetchMap = new Map<string, any>();

// todo: maybe cache responses
const fetchAPIData = async (url: string) => {
  //if (fetchMap.has(url)) reu
  const apiHeaders = {
    "x-rapidapi-host": process.env.EXPO_PUBLIC_API_HOST ?? "",
    "x-rapidapi-key": process.env.EXPO_PUBLIC_API_KEY ?? "",
  };

  const res = await fetch(url, { method: "GET", headers: apiHeaders });

  if (!res.ok) return null;
  return await res.json();
};

/**
 * Get teams from api
 */
const getTeams = async (league: League): Promise<Team[]> => {
  if (teams.size > 0) return teamArray();

  const url = process.env.EXPO_PUBLIC_API_URL + "teams";
  const data = await fetchAPIData(url);

  if (Array.isArray(data)) {
    data.forEach((team) => {
      if (isTeamInfo(team)) {
        const info = team as TeamInfo;
        if (!teams.has(info.id)) teams.set(team.id, { info });
      }
    });

    return teamArray();
  }

  return [];
};

/**
 * Get team information from api
 * @param id team id
 */
const getTeam = async (id: number): Promise<Team | null> => {
  let team = teams.get(id);
  if (teams.get(id)) return team ?? null;

  const url = process.env.EXPO_PUBLIC_API_URL + "teams/" + id;
  const data = await fetchAPIData(url);

  if (data && isTeamInfo(data)) {
    const teamInfo = data as TeamInfo;
    team = { info: teamInfo };
    teams.set(id, team);
    return team;
  }

  return null;
};

/**
 * Get team stats from api
 * @param id team id
 */
const getTeamStats = async (id: number) => {};

export { getTeam, getTeams };

