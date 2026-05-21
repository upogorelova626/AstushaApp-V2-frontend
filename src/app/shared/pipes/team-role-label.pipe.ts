import {Pipe, PipeTransform} from '@angular/core';
import {TeamRole} from '../../features/teams/interfaces/team-members.interface';

@Pipe({
    name: 'teamRoleLabel'
})
export class TeamRoleLabelPipe implements PipeTransform {
    transform(role: string | null | undefined): string {
        if (!role) {
            return 'Без роли';
        }
        switch (role) {
            case TeamRole.Owner:
                return 'Создатель';
            case TeamRole.Admin:
                return 'Администратор';
            case TeamRole.Member:
                return 'Участник';
            default:
                return role;
        }
    }
}
