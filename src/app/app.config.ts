import {provideTaiga} from '@taiga-ui/core';
import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {credentialsInterceptor} from './features/auth/interceptors/auth.interceptor';

import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideTaiga(),
        provideHttpClient(withInterceptors([credentialsInterceptor]))
    ]
};
