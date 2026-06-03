import {Routes} from '@angular/router';

import {authGuard} from './features/auth/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadComponent: () =>
            import('./layouts/auth-layout/auth-layout.component').then(
                m => m.AuthLayoutComponent
            ),
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'login'
            },
            {
                path: 'login',
                loadComponent: () =>
                    import('./features/auth/pages/login-page/login-page.component').then(
                        m => m.LoginPageComponent
                    )
            },
            {
                path: 'create-account',
                loadComponent: () =>
                    import('./features/auth/pages/create-account/create-account.component').then(
                        m => m.CreateAccountComponent
                    )
            },
            {
                path: 'forgot-password',
                loadComponent: () =>
                    import('./features/auth/pages/forgot-password/forgot-password.component').then(
                        m => m.ForgotPasswordComponent
                    )
            }
        ]
    },
    {
        path: 'dashboard',
        loadComponent: () =>
            import('./layouts/app-layout/app-layout.component').then(
                m => m.AppLayoutComponent
            ),
        canActivate: [authGuard],
        canActivateChild: [authGuard],
        data: {
            breadcrumb: 'AstushaApp'
        },
        children: [
            {
                path: 'settings',
                loadComponent: () =>
                    import('./features/settings/settings-page/settings-page.component').then(
                        m => m.SettingsPageComponent
                    ),
                data: {
                    breadcrumb: 'Настройки'
                }
            },
            {
                path: 'my-tasks',
                data: {
                    breadcrumb: 'Мои задачи'
                },
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./features/my-tasks/pages/my-tasks-page/my-tasks-page.component').then(
                                m => m.MyTasksPageComponent
                            )
                    },
                    {
                        path: ':taskId',
                        loadComponent: () =>
                            import('./features/my-tasks/pages/task-page/task-page.component').then(
                                m => m.TaskPageComponent
                            ),
                        data: {
                            breadcrumb: 'Задача'
                        }
                    }
                ]
            },
            {
                path: 'teams',
                data: {
                    breadcrumb: 'Команды'
                },
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./features/teams/teams-page/teams-page.component').then(
                                m => m.TeamsPageComponent
                            )
                    },
                    {
                        path: ':teamId/settings',
                        loadComponent: () =>
                            import('./features/teams/team-settings-page/team-settings-page.component').then(
                                m => m.TeamSettingsPageComponent
                            ),
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
                        loadComponent: () =>
                            import('./features/projects/pages/projects-page/projects-page.component').then(
                                m => m.ProjectsPageComponent
                            )
                    },
                    {
                        path: ':projectId',
                        loadComponent: () =>
                            import('./layouts/project-layout/project-layout.component').then(
                                m => m.ProjectLayoutComponent
                            ),
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                redirectTo: 'overview'
                            },
                            {
                                path: 'overview',
                                loadComponent: () =>
                                    import('./features/projects/pages/project-detail-page/project-detail-page.component').then(
                                        m => m.ProjectDetailPageComponent
                                    ),
                                data: {
                                    breadcrumb: 'Проект'
                                }
                            },
                            {
                                path: 'tasks',
                                loadComponent: () =>
                                    import('./features/projects/pages/project-tasks-page/project-tasks-page.component').then(
                                        m => m.ProjectTasksPageComponent
                                    ),
                                data: {
                                    breadcrumb: 'Задачи проекта'
                                }
                            },
                            {
                                path: 'members',
                                loadComponent: () =>
                                    import('./features/projects/pages/project-members-page/project-members-page.component').then(
                                        m => m.ProjectMembersPageComponent
                                    ),
                                data: {
                                    breadcrumb: 'Участники проекта'
                                }
                            },
                            {
                                path: 'settings',
                                loadComponent: () =>
                                    import('./features/projects/pages/project-settings-page/project-settings-page.component').then(
                                        m => m.ProjectSettingsPageComponent
                                    ),
                                data: {
                                    breadcrumb: 'Настройки проекта'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                path: '',
                loadComponent: () =>
                    import('./features/dashboard/boards-page/boards-page.component').then(
                        m => m.BoardsPageComponent
                    ),
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
        loadComponent: () =>
            import('./features/not-found/not-found-page/not-found-page.component').then(
                m => m.NotFoundPageComponent
            )
    }
];
