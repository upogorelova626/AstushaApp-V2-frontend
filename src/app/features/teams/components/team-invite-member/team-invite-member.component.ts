import {HttpErrorResponse} from '@angular/common/http';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    signal
} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {finalize} from 'rxjs';

import {TuiActiveZone} from '@taiga-ui/cdk/directives/active-zone';
import {TuiObscured} from '@taiga-ui/cdk/directives/obscured';
import {
    TuiButton,
    TuiDataList,
    TuiDropdown,
    TuiIcon,
    TuiInput,
    TuiTextfield,
    TuiTitle,
    TuiError
} from '@taiga-ui/core';
import {TuiChevron, TuiTextarea} from '@taiga-ui/kit';

import {Roles} from '../../interfaces/roles.interface';
import {
    TeamMemberCandidate,
    TeamRole
} from '../../interfaces/team-members.interface';
import {TeamMembersService} from '../../services/team-members.service';
import {
    noSpacesValidator,
    notBlankValidator
} from '../../validators/search-identifier.validator';

@Component({
    selector: 'app-team-invite-member',
    imports: [
        ReactiveFormsModule,
        TuiActiveZone,
        TuiButton,
        TuiChevron,
        TuiDataList,
        TuiDropdown,
        TuiIcon,
        TuiInput,
        TuiObscured,
        TuiTextarea,
        TuiTextfield,
        TuiTitle,
        TuiError
    ],
    templateUrl: './team-invite-member.component.html',
    styleUrl: './team-invite-member.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamInviteMemberComponent {
    private readonly teamMemberService = inject(TeamMembersService);

    readonly teamId = input.required<string>();

    protected readonly open = signal(false);
    protected readonly selected = signal<Roles | null>(null);

    protected readonly isSearching = signal(false);
    protected readonly isSubmitting = signal(false);

    protected readonly lookupError = signal<string | null>(null);
    protected readonly roleError = signal<string | null>(null);
    protected readonly foundUser = signal<TeamMemberCandidate | null>(null);

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

    protected readonly lookupForm = new FormControl('', {
        nonNullable: true,
        validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(255),
            notBlankValidator(),
            noSpacesValidator()
        ]
    });

    protected readonly messageControl = new FormControl('', {
        nonNullable: true,
        validators: [Validators.maxLength(500)]
    });

    protected readonly buttonLabel = computed(
        () => this.selected()?.title ?? 'Выберите роль для участника'
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
        this.roleError.set(null);
        this.lookupError.set(null);
        this.open.set(false);
    }

    protected resetFoundUser(): void {
        this.foundUser.set(null);
        this.lookupError.set(null);
    }

    protected searchUser(): void {
        if (this.isSearching()) {
            return;
        }

        this.lookupForm.markAsTouched();

        if (this.lookupForm.invalid) {
            this.foundUser.set(null);
            this.lookupError.set('Введите корректный email или логин');

            return;
        }

        const identifier = this.lookupForm.value.trim();

        this.isSearching.set(true);
        this.lookupError.set(null);
        this.foundUser.set(null);

        this.teamMemberService
            .lookupTeamMemberCandidate(this.teamId(), identifier)
            .pipe(finalize(() => this.isSearching.set(false)))
            .subscribe({
                next: user => {
                    this.foundUser.set(user);
                    this.lookupForm.setValue(user.login, {emitEvent: false});
                },
                error: (error: HttpErrorResponse) => {
                    this.lookupError.set(this.getLookupErrorMessage(error));
                }
            });
    }

    protected addMember(): void {
        if (this.isSubmitting()) {
            return;
        }

        const user = this.foundUser();
        const role = this.selected()?.value;

        this.lookupError.set(null);
        this.roleError.set(null);
        this.messageControl.markAsTouched();

        if (!user) {
            this.lookupError.set('Сначала найдите пользователя');

            return;
        }

        if (!role) {
            this.roleError.set('Выберите роль участника');

            return;
        }

        if (this.messageControl.invalid) {
            this.lookupError.set(
                'Сообщение не должно быть длиннее 500 символов'
            );

            return;
        }

        this.isSubmitting.set(true);

        this.teamMemberService
            .addTeamMember(this.teamId(), {
                userId: user.id,
                role
            })
            .pipe(finalize(() => this.isSubmitting.set(false)))
            .subscribe({
                next: () => {
                    this.clearForm();
                },
                error: (error: HttpErrorResponse) => {
                    this.lookupError.set(this.getLookupErrorMessage(error));
                }
            });
    }

    protected clearForm(): void {
        this.foundUser.set(null);
        this.selected.set(null);
        this.lookupForm.reset();
        this.messageControl.reset();
        this.lookupError.set(null);
        this.roleError.set(null);
    }

    private getLookupErrorMessage(error: HttpErrorResponse): string {
        switch (error.status) {
            case 400:
                return 'Нельзя добавить себя в команду';

            case 403:
                return 'Недостаточно прав для добавления участников';

            case 404:
                return 'Пользователь не найден';

            case 409:
                return 'Пользователь уже состоит в команде';

            default:
                return 'Не удалось выполнить действие';
        }
    }
}
