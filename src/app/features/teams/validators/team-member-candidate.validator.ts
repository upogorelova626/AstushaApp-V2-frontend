import {HttpErrorResponse} from '@angular/common/http';
import {
    AbstractControl,
    AsyncValidatorFn,
    ValidationErrors
} from '@angular/forms';
import {catchError, map, Observable, of, switchMap, timer} from 'rxjs';

import {TeamMembersService} from '../services/team-members.service';

export function teamMemberCandidateValidator(
    teamId: () => string,
    teamMembersService: TeamMembersService
): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        const value = control.value;
        const identifier = typeof value === 'string' ? value.trim() : '';

        if (!identifier) {
            return of(null);
        }

        return timer(400).pipe(
            switchMap(() =>
                teamMembersService.lookupTeamMemberCandidate(
                    teamId(),
                    identifier
                )
            ),
            map(() => null),
            catchError((error: HttpErrorResponse) => {
                switch (error.status) {
                    case 400:
                        return of({currentUser: true});

                    case 403:
                        return of({cannotManageTeamMembers: true});

                    case 404:
                        return of({userNotFound: true});

                    case 409:
                        return of({alreadyInTeam: true});

                    default:
                        return of({userLookupFailed: true});
                }
            })
        );
    };
}
