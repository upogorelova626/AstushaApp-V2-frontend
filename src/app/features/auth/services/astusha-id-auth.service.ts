import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {AstushaUser} from '../../users/models/interfaces/user.interface';
import {AuthUser} from '../models/interfaces/auth.interface';

const ASTUSHA_ID_API_URL = 'http://localhost:3002';

@Injectable({
    providedIn: 'root'
})
export class AstushaIdAuthService {
    private readonly http = inject(HttpClient);

    getMe() {
        return this.http.get<AuthUser>(`${ASTUSHA_ID_API_URL}/users/me`);
    }

    refresh() {
        return this.http.post<AuthUser>(
            `${ASTUSHA_ID_API_URL}/auth/refresh`,
            null
        );
    }

    logout() {
        return this.http.post(`${ASTUSHA_ID_API_URL}/auth/logout`, null);
    }
}
