import {Routes} from '@angular/router';
import {authGuard} from './features/auth/guards/auth.guard';
import {AuthLayoutComponent} from './layouts/auth-layout/auth-layout.component';
import {CreateAccountComponent} from './features/auth/pages/create-account/create-account.component';
import {LoginPageComponent} from './features/auth/pages/login-page/login-page.component';
import {ForgotPasswordComponent} from './features/auth/pages/forgot-password/forgot-password.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'auth/create-account'
    },
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'login',
                component: LoginPageComponent
            },
            {
                path: 'create-account',
                component: CreateAccountComponent
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'create-account'
            }
        ]
    }
];
