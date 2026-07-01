import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthResponse, AuthUser} from '../models/interfaces/auth.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);

    private readonly baseApiUrl = 'http://localhost:3000';

    me() {
        return this.http.get<AuthUser>(`${this.baseApiUrl}/auth/me`);
    }

    refresh() {
        return this.http.post<AuthResponse>(
            `${this.baseApiUrl}/auth/refresh`,
            {}
        );
    }
}
