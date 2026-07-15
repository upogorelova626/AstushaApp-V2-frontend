import {HttpErrorResponse} from '@angular/common/http';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    computed,
    inject,
    input,
    OnInit,
    signal
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    EMPTY,
    finalize,
    map,
    switchMap,
    tap
} from 'rxjs';
import {TuiActiveZone} from '@taiga-ui/cdk/directives/active-zone';
import {TuiObscured} from '@taiga-ui/cdk/directives/obscured';
import {
    TuiButton,
    TuiDataList,
    TuiDropdown,
    TuiError,
    TuiIcon,
    TuiInput,
    TuiTextfield,
    TuiTitle
} from '@taiga-ui/core';
import {TuiChevron, TuiTextarea} from '@taiga-ui/kit';

import {Roles} from '../../../../../shared/interfaces/roles.interface';
import {
    TeamMemberCandidate,
    TeamRole
} from '../../../../../shared/interfaces/team-members.interface';
import {TeamMembersService} from '../../../../../shared/services/team-members.service';
import {
    noSpacesValidator,
    notBlankValidator
} from '../../../../../shared/validators/search-identifier.validator';

@Component({
    selector: 'app-team-invite-member',
    imports: [
        ReactiveFormsModule,
        TuiActiveZone,
        TuiButton,
        TuiChevron,
        TuiDataList,
        TuiDropdown,
        TuiError,
        TuiIcon,
        TuiInput,
        TuiObscured,
        TuiTextarea,
        TuiTextfield,
        TuiTitle
    ],
    templateUrl: './team-invite-member.component.html',
    styleUrl: './team-invite-member.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamInviteMemberComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly teamMemberService = inject(TeamMembersService);

    readonly teamId = input.required<string>();

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

    protected readonly open = signal(false);
    protected readonly selected = signal<Roles | null>(null);
    protected readonly foundUser = signal<TeamMemberCandidate | null>(null);

    protected readonly isSearching = signal(false);
    protected readonly isSubmitting = signal(false);

    protected readonly lookupError = signal<string | null>(null);
    protected readonly roleError = signal<string | null>(null);

    protected readonly buttonLabel = computed(
        () => this.selected()?.title ?? 'Выберите роль для участника'
    );

    ngOnInit() {
        this.lookupForm.valueChanges
            .pipe(
                debounceTime(500),
                map(identifier => identifier.trim()),
                distinctUntilChanged(),
                tap(() => {
                    this.foundUser.set(null);
                    this.lookupError.set(null);
                }),
                switchMap(identifier => {
                    if (this.lookupForm.invalid) {
                        this.isSearching.set(false);

                        return EMPTY;
                    }

                    this.isSearching.set(true);

                    return this.teamMemberService
                        .lookupTeamMemberCandidate(this.teamId(), identifier)
                        .pipe(
                            finalize(() => {
                                this.isSearching.set(false);
                            }),
                            catchError((error: HttpErrorResponse) => {
                                this.lookupError.set(
                                    this.getLookupErrorMessage(error)
                                );

                                return EMPTY;
                            })
                        );
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(user => {
                this.foundUser.set(user);
                this.lookupForm.setValue(user.login, {emitEvent: false});
            });
    }

    protected onClick() {
        this.open.update(open => !open);
    }

    protected onObscured(obscured: boolean) {
        if (obscured) {
            this.open.set(false);
        }
    }

    protected onActiveZone(active: boolean) {
        if (!active) {
            this.open.set(false);
        }
    }

    protected onSelect(role: Roles) {
        this.selected.set(role);
        this.roleError.set(null);
        this.open.set(false);
    }

    protected addMember() {
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
            return;
        }

        this.isSubmitting.set(true);

        this.teamMemberService
            .addTeamMember(this.teamId(), {
                userId: user.id,
                role
            })
            .pipe(
                finalize(() => {
                    this.isSubmitting.set(false);
                })
            )
            .subscribe({
                next: () => {
                    this.clearForm();
                },
                error: (error: HttpErrorResponse) => {
                    this.lookupError.set(this.getLookupErrorMessage(error));
                }
            });
    }

    protected clearForm() {
        this.lookupForm.reset();
        this.messageControl.reset();

        this.selected.set(null);
        this.foundUser.set(null);
        this.lookupError.set(null);
        this.roleError.set(null);
        this.isSearching.set(false);
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
