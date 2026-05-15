export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    position?: string;
    about?: string;
}

export interface ChangePassword {
    currentPassword: string;
    newPassword: string;
}

export interface SuccessResponse {
    success: boolean;
}
