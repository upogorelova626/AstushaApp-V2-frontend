import {
    ChangeDetectionStrategy,
    Component,
    effect,
    inject,
    input,
    signal
} from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import {TuiButton, TuiInput, TuiTextfield} from '@taiga-ui/core';
import {TuiSkeleton, TuiTextarea} from '@taiga-ui/kit';
import {finalize} from 'rxjs';

import {Team} from '../../../interfaces/team.interface';
import {TeamsService} from '../../../services/teams.service';

interface TeamMainSettingsFormValue {
    name: string;
    description: string;
    avatarUrl: string;
}

@Component({
    selector: 'app-team-main-settings',
    imports: [
        TuiButton,
        TuiInput,
        TuiTextarea,
        TuiTextfield,
        TuiSkeleton,
        ReactiveFormsModule
    ],
    templateUrl: './team-main-settings.component.html',
    styleUrl: './team-main-settings.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamMainSettingsComponent {
    readonly team = input<Team | null>(null);
    readonly isLoading = input(false);

    private readonly teamsService = inject(TeamsService);

    protected readonly isEditing = signal(false);
    protected readonly isSaving = signal(false);

    private initialFormValue: TeamMainSettingsFormValue = {
        name: '',
        description: '',
        avatarUrl: ''
    };

    protected readonly form = new FormGroup({
        name: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(100)]
        }),
        description: new FormControl('', {
            nonNullable: true,
            validators: [Validators.maxLength(500)]
        }),
        avatarUrl: new FormControl('', {
            nonNullable: true,
            validators: [Validators.maxLength(500)]
        })
    });

    constructor() {
        this.form.disable();

        effect(() => {
            const team = this.team();

            if (!team) {
                this.patchForm({
                    name: '',
                    description: '',
                    avatarUrl: ''
                });

                return;
            }

            const formValue: TeamMainSettingsFormValue = {
                name: team.name,
                description: team.description ?? '',
                avatarUrl: team.avatarUrl ?? ''
            };

            this.initialFormValue = formValue;
            this.patchForm(formValue);
        });
    }

    protected startEditing(): void {
        if (!this.team() || this.isLoading() || this.isSaving()) {
            return;
        }

        this.isEditing.set(true);
        this.form.enable();
    }

    protected saveTeam(): void {
        const team = this.team();

        if (!team) {
            return;
        }

        if (this.form.invalid) {
            this.form.markAllAsTouched();

            return;
        }

        const rawValue = this.form.getRawValue();

        const payload = {
            name: rawValue.name.trim(),
            description: rawValue.description.trim() || undefined,
            avatarUrl: rawValue.avatarUrl.trim() || undefined
        };

        if (!payload.name) {
            this.form.controls.name.setErrors({
                required: true
            });
            this.form.controls.name.markAsTouched();

            return;
        }

        this.isSaving.set(true);

        this.teamsService
            .editTeam(team.id, payload)
            .pipe(
                finalize(() => {
                    this.isSaving.set(false);
                })
            )
            .subscribe({
                next: updatedTeam => {
                    const formValue: TeamMainSettingsFormValue = {
                        name: updatedTeam.name,
                        description: updatedTeam.description ?? '',
                        avatarUrl: updatedTeam.avatarUrl ?? ''
                    };

                    this.initialFormValue = formValue;
                    this.patchForm(formValue);

                    this.form.disable();
                    this.isEditing.set(false);
                },
                error: error => {
                    console.error('Не удалось обновить команду', error);
                }
            });
    }

    protected cancelEditing(): void {
        this.patchForm(this.initialFormValue);

        this.form.disable();
        this.isEditing.set(false);
    }

    private patchForm(value: TeamMainSettingsFormValue): void {
        this.form.patchValue(value);

        this.form.markAsPristine();
        this.form.markAsUntouched();
    }
}
