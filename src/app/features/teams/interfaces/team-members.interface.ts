export enum TeamRole {
    Owner = 'OWNER',
    Admin = 'ADMIN',
    Member = 'MEMBER'
}

export interface TeamMemberUser {
    id: string;
    login: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    position: string | null;
}

export interface TeamMember {
    id: string;
    role: TeamRole;
    createdAt: string;
    updatedAt: string;
    user: TeamMemberUser;
}

export interface TeamMemberCandidate {
    id: string;
    login: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    position: string | null;
}

export interface AddTeamMemberRequest {
    userId: string;
    role: TeamRole.Admin | TeamRole.Member;
}

export interface UpdateTeamMemberRequest {
    role: TeamRole.Admin | TeamRole.Member;
}

export interface SuccessResponse {
    success: boolean;
}
