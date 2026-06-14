export enum Theme {
    DARK = 'DARK',
    LIGHT = 'LIGHT'
}

export interface RegisterRequest {
    login: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthUser {
    id: string;
    login: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    position: string | null;
    about: string | null;
    createdAt: string;
    updatedAt: string;
    theme: Theme;
}
export interface AuthResponse {
    user: AuthUser;
}

export interface LogoutResponse {
    success: boolean;
}

export interface ChangeThemeRequest {
    theme: Theme;
}
