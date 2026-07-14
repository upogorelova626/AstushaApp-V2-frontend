import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    OnInit,
    signal
} from '@angular/core';
import {
    TuiButton,
    TuiDataList,
    TuiDropdown,
    TuiInput,
    TuiOption,
    TuiTextfield,
    TuiTitle
} from '@taiga-ui/core';
import {TuiAvatar, TuiChevron, TuiSkeleton} from '@taiga-ui/kit';
import {TuiObscured} from '@taiga-ui/cdk/directives/obscured';
import {PluralizeRuPipe} from '../../../../../shared/pipes/pluralize-ru.pipe';
import {
    TeamMember,
    TeamRole
} from '../../../../../shared/interfaces/team-members.interface';
import {
    TeamMemberAction,
    TeamMemberActionOption
} from '../../../../../shared/interfaces/dropdowns.interface';
import {TeamMembersService} from '../../../services/team-members.service';
import {TeamRoleLabelPipe} from '../../../../../shared/pipes/team-role-label.pipe';
import {TuiTable} from '@taiga-ui/addon-table';

@Component({
    selector: 'app-team-members-settings',
    imports: [
        TuiAvatar,
        TuiButton,
        TuiChevron,
        TuiInput,
        TuiTextfield,
        TuiObscured,
        TuiDataList,
        TuiDropdown,
        TuiOption,
        TuiTitle,
        PluralizeRuPipe,
        TeamRoleLabelPipe,
        TuiSkeleton,
        TuiTable
    ],
    templateUrl: './team-members-settings.component.html',
    styleUrl: './team-members-settings.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamMembersSettingsComponent implements OnInit {
    private readonly teamMembersService = inject(TeamMembersService);

    readonly teamId = input.required<string>();

    protected readonly teamMembers = signal<TeamMember[]>([]);
    protected readonly isLoading = signal(false);

    protected readonly openedMemberId = signal<string | null>(null);

    protected readonly memberActions: readonly TeamMemberActionOption[] = [
        {
            title: 'Профиль',
            value: TeamMemberAction.OpenProfile
        },
        {
            title: 'Изменить роль',
            value: TeamMemberAction.ChangeRole
        },
        {
            title: 'Удалить',
            value: TeamMemberAction.Delete
        }
    ];

    ngOnInit() {
        this.isLoading.set(true);

        this.teamMembersService.getTeamMembers(this.teamId()).subscribe({
            next: teamMembers => {
                this.teamMembers.set(teamMembers);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    protected toggleMemberActions(memberId: string) {
        this.openedMemberId.update(openedMemberId =>
            openedMemberId === memberId ? null : memberId
        );
    }

    protected onMemberObscured(obscured: boolean, memberId: string) {
        if (obscured && this.openedMemberId() === memberId) {
            this.openedMemberId.set(null);
        }
    }

    protected onMemberAction(action: TeamMemberAction, member: TeamMember) {
        this.openedMemberId.set(null);

        switch (action) {
            case TeamMemberAction.OpenProfile:
                this.openProfile(member);
                return;

            case TeamMemberAction.ChangeRole:
                this.changeMemberRole(member);
                return;

            case TeamMemberAction.Delete:
                this.deleteMember(member);
                return;
        }
    }

    protected canShowAction(
        action: TeamMemberActionOption,
        member: TeamMember
    ): boolean {
        if (action.value === TeamMemberAction.OpenProfile) {
            return true;
        }

        return member.role !== TeamRole.Owner;
    }

    protected getRoleLabel(role: TeamRole): string {
        switch (role) {
            case TeamRole.Owner:
                return 'Создатель';

            case TeamRole.Admin:
                return 'Администратор';

            case TeamRole.Member:
                return 'Участник';
        }
    }

    protected changeMemberRole(member: TeamMember) {
        if (member.role === TeamRole.Owner) {
            return;
        }

        this.teamMembersService
            .updateTeamMember(this.teamId(), member.id, {
                role: this.getNextRole(member)
            })
            .subscribe(updatedMember =>
                this.teamMembers.update(members =>
                    members.map(currentMember =>
                        currentMember.id === updatedMember.id
                            ? updatedMember
                            : currentMember
                    )
                )
            );
    }

    protected deleteMember(member: TeamMember) {
        if (member.role === TeamRole.Owner) {
            return;
        }

        this.teamMembersService
            .deleteTeamMember(this.teamId(), member.id)
            .subscribe(() =>
                this.teamMembers.update(members =>
                    members.filter(
                        currentMember => currentMember.id !== member.id
                    )
                )
            );
    }

    private getNextRole(member: TeamMember): TeamRole.Admin | TeamRole.Member {
        return member.role === TeamRole.Admin
            ? TeamRole.Member
            : TeamRole.Admin;
    }

    private openProfile(member: TeamMember) {
        void member;
    }
}
