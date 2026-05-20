import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    signal
} from '@angular/core';
import {
    TuiButton,
    TuiIcon,
    TuiInput,
    TuiTextfield,
    TuiDropdown,
    TuiDataList
} from '@taiga-ui/core';
import {TuiActiveZone} from '@taiga-ui/cdk/directives/active-zone';
import {TuiChevron, TuiTextarea} from '@taiga-ui/kit';
import {UsersService} from '../../../users/services/users.service';
import {TuiObscured} from '@taiga-ui/cdk/directives/obscured';
import {Roles, TeamRole} from '../../interfaces/roles.interface';

@Component({
    selector: 'app-team-invite-member',
    imports: [
        TuiButton,
        TuiChevron,
        TuiIcon,
        TuiInput,
        TuiTextarea,
        TuiTextfield,
        TuiObscured,
        TuiActiveZone,
        TuiDataList,
        TuiDropdown
    ],
    templateUrl: './team-invite-member.component.html',
    styleUrl: './team-invite-member.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamInviteMemberComponent {
    private readonly usersService = inject(UsersService);

    protected readonly roles: readonly Roles[] = [
        {
            title: 'Администратор',
            description: 'Может управлять участниками команды и настройками',
            value: TeamRole.Admin
        },
        {
            title: 'Участник',
            description: 'Может просматривать команду и участвовать в проектах',
            value: TeamRole.Member
        }
    ];

    protected readonly open = signal(false);
    protected readonly selected = signal<Roles | null>(null);
    protected readonly buttonLabel = computed(
        () => this.selected()?.title ?? 'Choose'
    );

    protected onClick(): void {
        this.open.update(open => !open);
    }

    protected onObscured(obscured: boolean): void {
        if (obscured) {
            this.open.set(false);
        }
    }

    protected onActiveZone(active: boolean): void {
        if (!active) {
            this.open.set(false);
        }
    }

    protected onSelect(role: Roles): void {
        this.selected.set(role);
        this.open.set(false);
    }
}
