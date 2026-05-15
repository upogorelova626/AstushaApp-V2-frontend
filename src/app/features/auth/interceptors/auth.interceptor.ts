import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {
    catchError,
    finalize,
    Observable,
    shareReplay,
    switchMap,
    throwError
} from 'rxjs';

import {AuthService} from '../services/auth.service';

const baseApiUrl = 'http://localhost:3000';

let refreshRequest$: Observable<unknown> | null = null;

export const credentialsInterceptor: HttpInterceptorFn = (request, next) => {
    const authService = inject(AuthService);

    if (!request.url.startsWith(baseApiUrl)) {
        return next(request);
    }

    const requestWithCredentials = request.clone({
        withCredentials: true
    });

    return next(requestWithCredentials).pipe(
        catchError((error: unknown) => {
            const isUnauthorized =
                error instanceof HttpErrorResponse && error.status === 401;

            const isRefreshRequest = request.url.includes('/auth/refresh');
            const isLoginRequest = request.url.includes('/auth/login');
            const isRegisterRequest = request.url.includes('/auth/register');
            const isLogoutRequest = request.url.includes('/auth/logout');

            if (
                !isUnauthorized ||
                isRefreshRequest ||
                isLoginRequest ||
                isRegisterRequest ||
                isLogoutRequest
            ) {
                return throwError(() => error);
            }

            if (!refreshRequest$) {
                refreshRequest$ = authService.refresh().pipe(
                    shareReplay(1),
                    finalize(() => {
                        refreshRequest$ = null;
                    })
                );
            }

            return refreshRequest$.pipe(
                switchMap(() => next(requestWithCredentials)),
                catchError(refreshError => throwError(() => refreshError))
            );
        })
    );
};
