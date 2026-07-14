import {Team} from '../../../features/teams/interfaces/team.interface';

export interface ProjectTeam {
    id: string;
    projectId: string;
    teamId: string;
    createdAt: string;
    team: Team;
}
