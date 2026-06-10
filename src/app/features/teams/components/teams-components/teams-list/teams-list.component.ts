import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    output,
    signal
} from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import {
    TUI_VALIDATION_ERRORS,
    TuiButton,
    TuiDialog,
    TuiError,
    TuiHint,
    TuiIcon,
    TuiInput,
    TuiLabel,
    TuiTextfield
} from '@taiga-ui/core';
import {TuiTextarea, TuiSkeleton} from '@taiga-ui/kit';
import {finalize} from 'rxjs';
import {VALIDATION_ERRORS} from '../../../../../shared/constants/validation-errors';
import {TeamRoleLabelPipe} from '../../../../../shared/pipes/team-role-label.pipe';
import {Team} from '../../../interfaces/team.interface';
import {TeamsService} from '../../../services/teams.service';
import {TuiLoader} from '@taiga-ui/core';

@Component({
    selector: 'app-teams-list',
    imports: [
        ReactiveFormsModule,
        TuiButton,
        TuiDialog,
        TuiError,
        TuiHint,
        TuiIcon,
        TuiInput,
        TuiLabel,
        TuiTextarea,
        TuiTextfield,
        TeamRoleLabelPipe,
        TuiLoader
    ],
    templateUrl: './teams-list.component.html',
    styleUrl: './teams-list.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: TUI_VALIDATION_ERRORS,
            useValue: VALIDATION_ERRORS
        }
    ]
})
export class TeamListComponent implements OnInit {
    private readonly teamsService = inject(TeamsService);

    readonly teamSelected = output<string>();

    protected readonly teams = signal<Team[]>([]);
    protected readonly isLoading = signal(false);

    protected isCreateTeamDialogOpen = false;

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

    ngOnInit() {
        this.loadTeams();
    }

    protected openCreateTeamDialog() {
        console.log('open dialog click');

        this.isCreateTeamDialogOpen = true;

        console.log(this.isCreateTeamDialogOpen);
    }

    protected closeCreateTeamDialog() {
        this.isCreateTeamDialogOpen = false;
    }

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
            this.closeCreateTeamDialog();
            this.form.reset();
            this.loadTeams();
        });
    }

    protected selectTeam(teamId: string) {
        this.teamSelected.emit(teamId);
    }

    private loadTeams() {
        this.isLoading.set(true);

        this.teamsService
            .getTeams()
            .pipe(
                finalize(() => {
                    this.isLoading.set(false);
                })
            )
            .subscribe(teams => {
                this.teams.set(teams);
            });
    }
}
