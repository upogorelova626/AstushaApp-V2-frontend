export type TeamRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export interface CreateTeamRequest {
    name: string;
    description?: string;
}

export interface UpdateTeamRequest {
    name?: string;
    description?: string;
    avatarUrl?: string;
}

export interface Team {
    id: string;
    name: string;
    description: string;
    avatarUrl: string;
    creatorId: string;
    createdAt: string;
    updatedAt: string;
    myRole: TeamRole | null;
    membersCount: number;
    projectsCount: number;
}

export interface ProjectTeam {
    id: string;
    projectId: string;
    teamId: string;
    createdAt: string;
    team: Team;
}

export interface DeleteTeamResponse {
    success: boolean;
}
