import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {
    ReactiveFormsModule,
    FormControl,
    Validators,
    FormGroup
} from '@angular/forms';
import {TeamsService} from '../../../../../../shared/services/teams.service';
import {injectContext} from '@taiga-ui/polymorpheus';
import {
    TuiError,
    TuiTextfield,
    TuiInput,
    TuiLabel,
    TuiButton,
    TuiDialogContext,
    TUI_VALIDATION_ERRORS
} from '@taiga-ui/core';
import {TuiTextarea} from '@taiga-ui/kit';
import {VALIDATION_ERRORS} from '../../../../../../shared/constants/validation-errors';

@Component({
    selector: 'app-create-team-dialog',
    imports: [
        TuiError,
        TuiTextfield,
        TuiInput,
        ReactiveFormsModule,
        TuiLabel,
        TuiButton,
        TuiTextarea
    ],
    templateUrl: './create-team-dialog.component.html',
    styleUrl: './create-team-dialog.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: TUI_VALIDATION_ERRORS,
            useValue: VALIDATION_ERRORS
        }
    ]
})
export class CreateTeamDialogComponent {
    protected readonly context =
        injectContext<TuiDialogContext<boolean, void>>();
    private readonly teamsService = inject(TeamsService);

    protected readonly form = new FormGroup({
        name: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(100)]
        }),
        description: new FormControl('', {
            nonNullable: true,
            validators: [Validators.maxLength(500)]
        })
    });

    protected createTeam() {
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

        this.teamsService.createTeam(payload).subscribe(() => {
            this.context.completeWith(true);
        });
    }

    protected closeCreateTeamDialog() {
        this.context.$implicit.complete();
    }
}
