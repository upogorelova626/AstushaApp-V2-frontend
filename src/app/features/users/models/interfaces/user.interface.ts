export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    position?: string;
    about?: string;
}

export interface UserLookupResult {
    id: string;
    login: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    position: string | null;
}

export interface ChangePassword {
    currentPassword: string;
    newPassword: string;
}

export interface SuccessResponse {
    success: boolean;
}
