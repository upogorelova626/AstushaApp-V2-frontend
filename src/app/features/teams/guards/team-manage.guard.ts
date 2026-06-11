import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router} from '@angular/router';
import {catchError, forkJoin, map, of} from 'rxjs';
import {AuthService} from '../../auth/services/auth.service';
import {TeamMembersService} from '../services/team-members.service';
import {TeamRole} from '../interfaces/team-members.interface';

function getTeamId(route: ActivatedRouteSnapshot): string | null {
    let currentRoute: ActivatedRouteSnapshot | null = route;

    while (currentRoute) {
        const teamId = currentRoute.paramMap.get('teamId');

        if (teamId) {
            return teamId;
        }

        currentRoute = currentRoute.parent;
    }

    return null;
}

export const teamManageGuard: CanActivateFn = route => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const teamMembersService = inject(TeamMembersService);

    const teamId = getTeamId(route);

    if (!teamId) {
        return router.createUrlTree(['/dashboard/teams']);
    }

    return forkJoin({
        me: authService.me(),
        members: teamMembersService.getTeamMembers(teamId)
    }).pipe(
        map(({me, members}) => {
            const currentTeamMember = members.find(member => {
                return member.user.id === me.id;
            });

            const canManageProject =
                currentTeamMember?.role === TeamRole.Admin ||
                currentTeamMember?.role === TeamRole.Owner;

            if (canManageProject) {
                return true;
            }

            return router.createUrlTree(['/dashboard/teams', teamId]);
        }),
        catchError(() => {
            return of(router.createUrlTree(['/dashboard/teams']));
        })
    );
};
