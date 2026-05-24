import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
    RegisterRequest,
    AuthResponse,
    LoginRequest,
    AuthUser,
    LogoutResponse
} from '../models/interfaces/auth.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);

    private readonly baseApiUrl = 'http://localhost:3000';

    createAccount(payload: RegisterRequest) {
        return this.http.post<AuthResponse>(
            `${this.baseApiUrl}/auth/register`,
            payload
        );
    }

    login(payload: LoginRequest) {
        return this.http.post<AuthResponse>(
            `${this.baseApiUrl}/auth/login`,
            payload
        );
    }

    logout() {
        return this.http.post<LogoutResponse>(
            `${this.baseApiUrl}/auth/logout`,
            {}
        );
    }

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
