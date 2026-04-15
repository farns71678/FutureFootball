import { League } from "./api";
import { Team } from "./team";

const maxTeams = 3;

export class TeamTrio {
  league: League;
  teams: Team[] = [];

  constructor(league: League) {
    this.league = league;
  }

  addTeam(team: Team) {
    if (this.teams.length < maxTeams) {
      this.teams.push(team);
    }
  }

  removeTeam(id: number) {
    this.teams = this.teams.filter((t) => t.id != id);
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
