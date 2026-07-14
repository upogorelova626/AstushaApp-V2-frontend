import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    OnInit,
    signal
} from '@angular/core';
import {TuiButton, TuiIcon} from '@taiga-ui/core';
import {Team} from '../../../../../shared/interfaces/team.interface';
import {TeamMembersService} from '../../../services/team-members.service';
import {
    TeamMember,
    TeamRole
} from '../../../../../shared/interfaces/team-members.interface';
import {finalize} from 'rxjs';

@Component({
    selector: 'app-team-roles-settings',
    imports: [TuiButton, TuiIcon],
    templateUrl: './team-roles-settings.component.html',
    styleUrl: './team-roles-settings.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamRolesSettingsComponent implements OnInit {
    readonly team = input<Team | null>(null);

    private readonly teamMembersService = inject(TeamMembersService);

    protected readonly teamMembers = signal<TeamMember[]>([]);
    protected readonly isLoading = signal(false);

    protected readonly adminCount = computed(() => {
        const teamMembers = this.teamMembers();
        if (!teamMembers) {
            return;
        }

        return teamMembers.filter(member => member.role === TeamRole.Admin)
            .length;
    });

    protected readonly memberCount = computed(() => {
        const teamMembers = this.teamMembers();
        if (!teamMembers) {
            return;
        }

        return teamMembers.filter(member => member.role === TeamRole.Member)
            .length;
    });

    ngOnInit() {
        const team = this.team();
        if (!team) {
            return;
        }
        this.isLoading.set(true);
        this.teamMembersService
            .getTeamMembers(team.id)
            .pipe(
                finalize(() => {
                    this.isLoading.set(false);
                })
            )
            .subscribe(teamMembers => {
                this.teamMembers.set(teamMembers);
            });
    }

    protected readonly rolesButtons = computed(() => [
        {
            role: 'Создатель',
            info: 'Полный доступ ко всем настройкам',
            count: 1
        },
        {
            role: 'Администратор',
            info: 'Управление участниками и проектами',
            count: this.adminCount()
        },
        {
            role: 'Участник',
            info: 'Доступ к проектам и задачам команды',
            count: this.memberCount()
        }
    ]);
}
