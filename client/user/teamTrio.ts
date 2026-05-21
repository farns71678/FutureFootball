import { getTeam, League, Team } from './api';

export class TeamTrio {
  league: League;
  teams: Team[] = [];
  static readonly maxTeams = 3;

  constructor(league: League) {
    this.league = league;
  }

  addTeam(team: Team) {
    if (this.teams.length < TeamTrio.maxTeams && !this.teams.find((t) => t.info.id === team.info.id)) {
      this.teams.push(team);
    }
  }

  removeTeam(id: number) {
    this.teams = this.teams.filter((t) => t.info.id !== id);
  }

  size() {
    return this.teams.length;
  }

  getTeam(index: number) {
    return this.teams[index];
  }

  getTeams() {
    return this.teams;
  }
}

export const createTrio = async (picks: { league: League; teams: number[] }) => {
  const trio = new TeamTrio(picks.league);
  const teams = await Promise.all(picks.teams.map(async (teamId) => await getTeam(teamId)));
  if (teams.every((team) => team)) {
    teams.forEach((team) => trio.addTeam(team!));
    return trio;
  }
  return null;
};
