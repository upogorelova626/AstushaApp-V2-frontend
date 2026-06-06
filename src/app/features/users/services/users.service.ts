import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {
    ChangePasswordRequest,
    UpdateProfileRequest,
    SuccessResponse,
    UserLookupResult
} from '../models/interfaces/user.interface';
import {AuthUser} from '../../auth/models/interfaces/auth.interface';
import {shareReplay, startWith, Subject, switchMap, tap} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private readonly http = inject(HttpClient);
    private readonly baseApiUrl = 'http://localhost:3000';

    private readonly refreshProfile$ = new Subject<void>();

    readonly profile$ = this.refreshProfile$.pipe(
        startWith(null),
        switchMap(() =>
            this.http.get<AuthUser>(`${this.baseApiUrl}/users/profile`)
        ),
        shareReplay(1)
    );

    getMyProfile() {
        return this.http.get<AuthUser>(`${this.baseApiUrl}/users/profile`);
    }

    changeMyProfile(formData: FormData) {
        return this.http
            .patch<AuthUser>(`${this.baseApiUrl}/users/profile`, formData)
            .pipe(tap(() => this.refreshProfile$.next()));
    }

    deleteMyProfile() {
        return this.http.delete<SuccessResponse>(
            `${this.baseApiUrl}/users/profile`
        );
    }

    changePassword(payload: ChangePasswordRequest) {
        return this.http.patch<SuccessResponse>(
            `${this.baseApiUrl}/users/profile/password`,
            payload
        );
    }

    lookupUser(identifier: string) {
        return this.http.get<UserLookupResult | null>(
            `${this.baseApiUrl}/users/lookup`,
            {
                params: {
                    identifier
                }
            }
        );
    }

    deleteMyAvatar() {
        return this.http
            .delete<AuthUser>(`${this.baseApiUrl}/users/profile/avatar`)
            .pipe(tap(() => this.refreshProfile$.next()));
    }
}
