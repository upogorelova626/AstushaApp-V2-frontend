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
import {TeamSettingsPageComponent} from './features/teams/team-settings-page/team-settings-page.component';
import {ProjectsPageComponent} from './features/projects/pages/projects-page/projects-page.component';
import {NotFoundPageComponent} from './features/not-found/not-found-page/not-found-page.component';
import {ProjectDetailPageComponent} from './features/projects/pages/project-detail-page/project-detail-page.component';

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
        data: {
            breadcrumb: 'AstushaApp'
        },
        children: [
            {
                path: 'settings',
                component: SettingsPageComponent,
                data: {
                    breadcrumb: 'Настройки'
                }
            },
            {
                path: 'teams',
                data: {
                    breadcrumb: 'Команды'
                },
                children: [
                    {
                        path: '',
                        component: TeamsPageComponent
                    },
                    {
                        path: ':teamId/settings',
                        component: TeamSettingsPageComponent,
                        data: {
                            breadcrumb: 'Настройки команды'
                        }
                    }
                ]
            },
            {
                path: 'projects',
                data: {
                    breadcrumb: 'Проекты'
                },
                children: [
                    {
                        path: '',
                        component: ProjectsPageComponent
                    },
                    {
                        path: ':projectId',
                        component: ProjectDetailPageComponent,
                        data: {
                            breadcrumb: 'Проект'
                        }
                    }
                ]
            },

            {
                path: '',
                component: DashboardPageComponent,
                data: {
                    breadcrumb: 'AstushaApp'
                }
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
        component: NotFoundPageComponent
    }
];
