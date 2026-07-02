import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router} from '@angular/router';
import {catchError, forkJoin, map, of} from 'rxjs';
import {ProjectsService} from '../services/projects.service';
import {AstushaIdAuthService} from '../../auth/services/astusha-id-auth.service';

function getProjectId(route: ActivatedRouteSnapshot): string | null {
    let currentRoute: ActivatedRouteSnapshot | null = route;

    while (currentRoute) {
        const projectId = currentRoute.paramMap.get('projectId');

        if (projectId) {
            return projectId;
        }

        currentRoute = currentRoute.parent;
    }

    return null;
}

export const projectManageGuard: CanActivateFn = route => {
    const router = inject(Router);
    const astushaIdAuthService = inject(AstushaIdAuthService);
    const projectsService = inject(ProjectsService);

    const projectId = getProjectId(route);

    if (!projectId) {
        return router.createUrlTree(['/dashboard/projects']);
    }

    return forkJoin({
        project: projectsService.getOneProject(projectId),
        me: astushaIdAuthService.getMe()
    }).pipe(
        map(({project, me}) => {
            const currentProjectMember = project.members.find(member => {
                return member.userId === me.id;
            });

            const canManageProject =
                currentProjectMember?.role === 'OWNER' ||
                currentProjectMember?.role === 'ADMIN';

            if (canManageProject) {
                return true;
            }

            return router.createUrlTree(['/dashboard/projects', projectId]);
        }),
        catchError(() => {
            return of(router.createUrlTree(['/dashboard/projects']));
        })
    );
};
