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

export interface TeamCount {
    members: number;
    projects: number;
}

export interface Team {
    id: string;
    name: string;
    description: string | null;
    avatarUrl: string | null;
    creatorId: string;
    createdAt: string;
    updatedAt: string;

    myRole?: TeamRole | null;

    _count?: TeamCount;

    membersCount?: number;
    projectsCount?: number;
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
