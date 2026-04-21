import { League, Team } from "./api";

const maxTeams = 3;

export class TeamTrio {
  league: League;
  teams: Team[] = [];

  constructor(league: League) {
    this.league = league;
  }

  addTeam(team: Team) {
    if (
      this.teams.length < maxTeams &&
      !this.teams.find((t) => t.info.id === team.info.id)
    ) {
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
