import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {UserLookupResult} from '../models/interfaces/user.interface';
import {AuthUser} from '../../auth/models/interfaces/auth.interface';
import {BehaviorSubject, catchError, Observable, of, tap} from 'rxjs';

import {AstushaIdAuthService} from '../../auth/services/astusha-id-auth.service';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private readonly http = inject(HttpClient);
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
}
