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
import {TuiTextarea} from '@taiga-ui/kit';
import {Team} from '../../../interfaces/team.interface';
import {TeamsService} from '../../../services/teams.service';

@Component({
    selector: 'app-team-main-settings',
    imports: [
        TuiButton,
        TuiInput,
        TuiTextarea,
        TuiTextfield,
        ReactiveFormsModule
    ],
    templateUrl: './team-main-settings.component.html',
    styleUrl: './team-main-settings.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamMainSettingsComponent {
    readonly team = input.required<Team>();

    private readonly teamsService = inject(TeamsService);

    protected readonly isEditing = signal(false);
    protected readonly isSaving = signal(false);

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

            this.form.patchValue({
                name: team.name,
                description: team.description ?? '',
                avatarUrl: team.avatarUrl ?? ''
            });

            this.form.markAsPristine();
            this.form.markAsUntouched();
        });
    }

    protected startEditing() {
        this.isEditing.set(true);
        this.form.enable();
    }

    protected saveTeam() {
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
            this.form.controls.name.setErrors({required: true});
            this.form.controls.name.markAsTouched();

            return;
        }

        this.isSaving.set(true);

        this.teamsService.editTeam(this.team().id, payload).subscribe({
            next: updatedTeam => {
                this.form.patchValue({
                    name: updatedTeam.name,
                    description: updatedTeam.description ?? '',
                    avatarUrl: updatedTeam.avatarUrl ?? ''
                });

                this.form.markAsPristine();
                this.form.markAsUntouched();

                this.form.disable();
                this.isEditing.set(false);
                this.isSaving.set(false);
            },
            error: error => {
                console.error('Не удалось обновить команду', error);

                this.isSaving.set(false);
            }
        });
    }

    protected cancelEditing() {
        const team = this.team();

        this.form.patchValue({
            name: team.name,
            description: team.description ?? '',
            avatarUrl: team.avatarUrl ?? ''
        });

        this.form.markAsPristine();
        this.form.markAsUntouched();

        this.form.disable();
        this.isEditing.set(false);
    }
}
