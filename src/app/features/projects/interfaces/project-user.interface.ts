export interface ProjectUser {
    id: string;
    login: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    position: string | null;
    about: string | null;
}
