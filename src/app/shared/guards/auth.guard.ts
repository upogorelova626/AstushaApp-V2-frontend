import {inject} from '@angular/core';
import {CanActivateFn} from '@angular/router';
import {catchError, map, of} from 'rxjs';

import {AstushaIdAuthService} from '../services/astusha-id-auth.service';

const ASTUSHA_ID_LOGIN_URL = 'http://localhost:4202/auth/login';

export const authGuard: CanActivateFn = (_route, state) => {
    const astushaIdAuthService = inject(AstushaIdAuthService);

    return astushaIdAuthService.getMe().pipe(
        map(() => true),
        catchError(() => {
            const returnUrl = `${window.location.origin}${state.url}`;

            window.location.href = `${ASTUSHA_ID_LOGIN_URL}?returnUrl=${encodeURIComponent(returnUrl)}`;

            return of(false);
        })
    );
};
