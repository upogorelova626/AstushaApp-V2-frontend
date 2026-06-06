export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    position?: string;
    about?: string;
}

export interface UserProfileResponse {
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    position?: string | null;
    about?: string | null;
    avatarUrl?: string | null;
}

export interface ProfileFormValue {
    email: string;
    firstName: string;
    lastName: string;
    position: string;
    about: string;
    avatarUrl: string;
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

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface SuccessResponse {
    success: boolean;
}
