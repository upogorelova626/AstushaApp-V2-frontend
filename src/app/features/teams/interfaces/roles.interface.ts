export enum TeamRole {
    Admin = 'ADMIN',
    Member = 'MEMBER'
}

export interface Roles {
    title: string;
    description: string;
    value: TeamRole;
}
