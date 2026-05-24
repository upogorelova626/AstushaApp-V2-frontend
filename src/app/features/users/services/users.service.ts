import {HttpClient} from '@angular/common/http';
import {inject, Injectable, signal} from '@angular/core';
import {
    ChangePassword,
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

    changeMyProfile(payload: UpdateProfileRequest) {
        return this.http
            .patch<AuthUser>(`${this.baseApiUrl}/users/profile`, payload)
            .pipe(tap(() => this.refreshProfile$.next()));
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
}
