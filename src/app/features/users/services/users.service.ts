import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {
    ChangePasswordRequest,
    SuccessResponse,
    UserLookupResult
} from '../models/interfaces/user.interface';
import {AuthUser} from '../../auth/models/interfaces/auth.interface';
import {
    catchError,
    map,
    merge,
    Observable,
    of,
    shareReplay,
    startWith,
    Subject,
    switchMap,
    tap
} from 'rxjs';
import {AuthService} from '../../auth/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private readonly http = inject(HttpClient);
    private readonly authService = inject(AuthService);

    private readonly baseApiUrl = 'http://localhost:3000';

    private readonly refreshProfile$ = new Subject<void>();
    private readonly clearProfile$ = new Subject<void>();

    readonly profile$: Observable<AuthUser | null> = merge(
        this.refreshProfile$.pipe(
            startWith(void 0),
            switchMap(() =>
                this.http
                    .get<AuthUser>(`${this.baseApiUrl}/users/profile`)
                    .pipe(catchError(() => of(null)))
            )
        ),
        this.clearProfile$.pipe(map(() => null))
    ).pipe(
        shareReplay({
            bufferSize: 1,
            refCount: true
        })
    );

    reloadProfile(): void {
        this.refreshProfile$.next();
    }

    clearProfile(): void {
        this.clearProfile$.next();
    }

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
        return this.http
            .patch<SuccessResponse>(
                `${this.baseApiUrl}/users/profile/password`,
                payload
            )
            .pipe(
                switchMap(() => this.authService.logout()),
                tap(() => this.clearProfile())
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
