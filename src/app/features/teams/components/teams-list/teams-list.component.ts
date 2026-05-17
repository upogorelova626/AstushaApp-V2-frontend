import {Component, inject} from '@angular/core';
import {
    TUI_VALIDATION_ERRORS,
    TuiButton,
    TuiDialog,
    TuiHint,
    TuiIcon,
    TuiInput,
    TuiLabel,
    TuiTextfield,
    TuiError
} from '@taiga-ui/core';
import {TuiTextarea} from '@taiga-ui/kit';
import {TeamsService} from '../../services/teams.service';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

@Component({
    selector: 'app-teams-list',
    imports: [
        TuiTextfield,
        TuiIcon,
        TuiButton,
        TuiInput,
        TuiHint,
        TuiDialog,
        TuiLabel,
        TuiTextarea,
        TuiError,
        ReactiveFormsModule
    ],
    templateUrl: './teams-list.component.html',
    styleUrl: './teams-list.component.less',
    providers: [
        {
            provide: TUI_VALIDATION_ERRORS,
            useValue: {
                required: 'Поле обязательно для заполнения',
                maxlength: ({requiredLength}: {requiredLength: number}) =>
                    `Максимальная длина — ${requiredLength} символов`
            }
        }
    ]
})
export class TeamsListComponent {
    private readonly teamsService = inject(TeamsService);

    protected isCreateTeamDialogOpen = false;

    protected openCreateTeamDialog(): void {
        this.isCreateTeamDialogOpen = true;
    }

    protected closeCreateTeamDialog(): void {
        this.isCreateTeamDialogOpen = false;
    }

    form = new FormGroup({
        name: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(100)]
        }),
        description: new FormControl('', {
            nonNullable: true,
            validators: [Validators.maxLength(500)]
        })
    });

    createTeam() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();

            return;
        }

        const rawValue = this.form.getRawValue();

        const payload = {
            name: rawValue.name.trim(),
            description: rawValue.description.trim() || undefined
        };

        if (!payload.name) {
            this.form.controls.name.setErrors({required: true});
            this.form.controls.name.markAsTouched();

            return;
        }
        this.teamsService.createTeam(payload).subscribe({
            next: () => {
                this.closeCreateTeamDialog();
                this.form.reset();
                this.teamsService.getTeams();
            }
        });
    }
}
