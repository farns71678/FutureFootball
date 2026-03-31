import { Team } from "./team";

const maxTeams = 3;

export class TeamTrio {
    name: string;
    teams: Team[] = [];

    constructor(name: string) {
        this.name = name;
    }

    addTeam(team: Team) {
        if (this.teams.length < maxTeams) {
            this.teams.push(team);
        }
    }

    removeTeam(id: number) {
        this.teams = this.teams.filter(t => t.id != id);
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