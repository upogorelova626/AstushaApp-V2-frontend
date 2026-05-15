import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {
    ChangePassword,
    UpdateProfileRequest,
    SuccessResponse
} from '../models/interfaces/user.interface';
import {AuthUser} from '../../auth/models/interfaces/auth.interface';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private readonly http = inject(HttpClient);

    readonly baseApiUrl = 'http://localhost:3000';

    getMyProfile() {
        return this.http.get<AuthUser>(`${this.baseApiUrl}/users/profile`);
    }

    changeMyProfile(payload: UpdateProfileRequest) {
        return this.http.patch<AuthUser>(
            `${this.baseApiUrl}/users/profile`,
            payload
        );
    }

    deleteMyProfile() {
        return this.http.delete<SuccessResponse>(
            `${this.baseApiUrl}/users/profile`
        );
    }

    changePassword(payload: ChangePassword) {
        return this.http.patch<SuccessResponse>(
            `${this.baseApiUrl}/users/profile/password`,
            payload
        );
    }
}
