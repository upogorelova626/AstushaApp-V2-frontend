import {Routes} from '@angular/router';

import {authGuard} from './features/auth/guards/auth.guard';
import {AuthLayoutComponent} from './layouts/auth-layout/auth-layout.component';
import {AppLayoutComponent} from './layouts/app-layout/app-layout.component';
import {CreateAccountComponent} from './features/auth/pages/create-account/create-account.component';
import {LoginPageComponent} from './features/auth/pages/login-page/login-page.component';
import {ForgotPasswordComponent} from './features/auth/pages/forgot-password/forgot-password.component';
import {DashboardPageComponent} from './features/dashboard/dashboard-page/dashboard-page.component';
import {SettingsPageComponent} from './features/settings/settings-page/settings-page.component';
import {TeamsPageComponent} from './features/teams/teams-page/teams-page.component';

export const routes: Routes = [
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'login'
            },
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
            }
        ]
    },
    {
        path: 'dashboard',
        component: AppLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'settings',
                component: SettingsPageComponent
            },
            {
                path: 'teams',
                component: TeamsPageComponent
            },

            {
                path: '',
                component: DashboardPageComponent
            }
        ]
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
