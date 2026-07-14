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

import {AstushaIdAuthService} from '../../../shared/services/astusha-id-auth.service';

const ASTUSHA_APP_API_URL = 'http://localhost:3000';
const ASTUSHA_ID_API_URL = 'http://localhost:3002';

let refreshRequest$: Observable<unknown> | null = null;

export const credentialsInterceptor: HttpInterceptorFn = (request, next) => {
    const astushaIdAuthService = inject(AstushaIdAuthService);

    const isAstushaAppRequest = request.url.startsWith(ASTUSHA_APP_API_URL);
    const isAstushaIdRequest = request.url.startsWith(ASTUSHA_ID_API_URL);

    if (!isAstushaAppRequest && !isAstushaIdRequest) {
        return next(request);
    }

    const requestWithCredentials = request.clone({
        withCredentials: true
    });

    return next(requestWithCredentials).pipe(
        catchError((error: unknown) => {
            const isUnauthorized =
                error instanceof HttpErrorResponse && error.status === 401;

            const isAuthRequest =
                request.url.includes('/auth/login') ||
                request.url.includes('/auth/create-account') ||
                request.url.includes('/auth/register') ||
                request.url.includes('/auth/refresh') ||
                request.url.includes('/auth/logout');

            if (!isUnauthorized || isAuthRequest) {
                return throwError(() => error);
            }

            if (!refreshRequest$) {
                refreshRequest$ = astushaIdAuthService.refresh().pipe(
                    shareReplay(1),
                    finalize(() => {
                        refreshRequest$ = null;
                    })
                );
            }

            return refreshRequest$.pipe(
                switchMap(() => next(requestWithCredentials)),
                catchError((refreshError: unknown) =>
                    throwError(() => refreshError)
                )
            );
        })
    );
};
