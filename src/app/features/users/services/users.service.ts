import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {
    ChangePasswordRequest,
    SuccessResponse,
    UserLookupResult
} from '../models/interfaces/user.interface';
import {
    AuthUser,
    ChangeThemeRequest
} from '../../auth/models/interfaces/auth.interface';
import {
    BehaviorSubject,
    catchError,
    Observable,
    of,
    switchMap,
    tap
} from 'rxjs';
import {AuthService} from '../../auth/services/auth.service';
import {AstushaIdAuthService} from '../../auth/services/astusha-id-auth.service';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private readonly http = inject(HttpClient);
    private readonly authService = inject(AuthService);
    private readonly astushaIdAuthService = inject(AstushaIdAuthService);

    private readonly astushaAppApiUrl = 'http://localhost:3000';
    private readonly astushaIdApiUrl = 'http://localhost:3000';

    private readonly profileSubject = new BehaviorSubject<AuthUser | null>(
        null
    );

    readonly profile$: Observable<AuthUser | null> =
        this.profileSubject.asObservable();

    reloadProfile(): void {
        this.getMyProfile()
            .pipe(
                catchError(() => {
                    this.clearProfile();

                    return of(null);
                })
            )
            .subscribe();
    }

    setProfile(profile: AuthUser | null): void {
        this.profileSubject.next(profile);
    }

    clearProfile(): void {
        this.profileSubject.next(null);
    }

    getMyProfile() {
        return this.astushaIdAuthService.getMe().pipe(
            tap(profile => {
                this.setProfile(profile);
            })
        );
    }

    changeMyProfile(formData: FormData) {
        return this.http
            .patch<AuthUser>(`${this.astushaAppApiUrl}/users/profile`, formData)
            .pipe(
                tap(profile => {
                    this.setProfile(profile);
                })
            );
    }

    deleteMyProfile() {
        return this.http.delete<SuccessResponse>(
            `${this.astushaAppApiUrl}/users/profile`
        );
    }

    changePassword(payload: ChangePasswordRequest) {
        return this.http
            .patch<SuccessResponse>(
                `${this.astushaAppApiUrl}/users/profile/password`,
                payload
            )
            .pipe(
                switchMap(() => this.authService.logout()),
                tap(() => {
                    this.clearProfile();
                })
            );
    }

    lookupUser(identifier: string) {
        return this.http.get<UserLookupResult | null>(
            `${this.astushaAppApiUrl}/users/lookup`,
            {
                params: {
                    identifier
                }
            }
        );
    }

    deleteMyAvatar() {
        return this.http
            .delete<AuthUser>(`${this.astushaAppApiUrl}/users/profile/avatar`)
            .pipe(
                tap(profile => {
                    this.setProfile(profile);
                })
            );
    }

    changeTheme(payload: ChangeThemeRequest) {
        return this.http
            .patch<AuthUser>(
                `${this.astushaAppApiUrl}/users/profile/theme`,
                payload
            )
            .pipe(
                tap(profile => {
                    this.setProfile(profile);
                })
            );
    }
}
