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
    TuiDropdown,
    TuiInput,
    TuiTextfield,
    TuiCalendar,
    TUI_VALIDATION_ERRORS,
    TuiError
} from '@taiga-ui/core';
import {TuiChevron, TuiTextarea, TuiInputDateDirective} from '@taiga-ui/kit';
import {
    ReactiveFormsModule,
    FormControl,
    Validators,
    FormGroup
} from '@angular/forms';
import {ProjectsService} from '../../../services/projects.service';
import {
    ProjectPriority,
    ProjectWorkflowType
} from '../../../interfaces/project.enums';
import {TuiDay} from '@taiga-ui/cdk';
import {
    deadlineAfterStartDateValidator,
    notPastDateValidator
} from '../../../validators/project-dates.validator';
import {
    ProjectSettingsFormValue,
    UpdateProjectRequest
} from '../../../interfaces/project.interface';
import {finalize, take} from 'rxjs';
import {VALIDATION_ERRORS} from '../../../../../shared/constants/validation-errors';

@Component({
    selector: 'app-project-main-settings',
    imports: [
        TuiButton,
        TuiChevron,
        TuiDropdown,
        TuiInput,
        TuiTextarea,
        TuiTextfield,
        ReactiveFormsModule,
        TuiInputDateDirective,
        TuiCalendar,
        TuiError
    ],
    templateUrl: './project-main-settings.component.html',
    styleUrl: './project-main-settings.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: TUI_VALIDATION_ERRORS,
            useValue: VALIDATION_ERRORS
        }
    ]
})
export class ProjectMainSettingsComponent implements OnInit {
    readonly projectId = input.required<string>();

    protected readonly isEditing = signal(false);
    protected readonly isSaving = signal(false);
    protected readonly isFormLoading = signal(true);

    private readonly projectsService = inject(ProjectsService);

    private initialFormValue: ProjectSettingsFormValue | null = null;

    private toTuiDay(date: string | null): TuiDay | null {
        if (!date) {
            return null;
        }

        return TuiDay.fromLocalNativeDate(new Date(date));
    }

    protected readonly form = new FormGroup(
        {
            title: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.maxLength(100),
                    Validators.minLength(2)
                ]
            }),

            description: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required, Validators.maxLength(1000)]
            }),

            workflowType: new FormControl<ProjectWorkflowType | null>(null, [
                Validators.required
            ]),

            priority: new FormControl<ProjectPriority | null>(null, [
                Validators.required
            ]),

            startDate: new FormControl<TuiDay | null>(null, [
                Validators.required,
                notPastDateValidator
            ]),

            deadline: new FormControl<TuiDay | null>(null, [
                Validators.required,
                notPastDateValidator
            ])
        },
        {
            validators: [deadlineAfterStartDateValidator]
        }
    );

    ngOnInit(): void {
        this.form.disable();
        this.isFormLoading.set(true);

        this.projectsService
            .getOneProject(this.projectId())
            .pipe(
                take(1),
                finalize(() => this.isFormLoading.set(false))
            )
            .subscribe(project => {
                const formValue: ProjectSettingsFormValue = {
                    title: project.title,
                    description: project.description,
                    workflowType: project.workflowType,
                    priority: project.priority,
                    startDate: this.toTuiDay(project.startDate),
                    deadline: this.toTuiDay(project.deadline)
                };

                this.form.patchValue(formValue);
                this.initialFormValue = formValue;

                this.form.markAsPristine();
                this.form.markAsUntouched();
            });
    }

    protected startEditing() {
        this.isEditing.set(true);
        this.form.enable();
    }

    protected cancelEditing() {
        if (this.initialFormValue) {
            this.form.patchValue(this.initialFormValue);
        }

        this.form.markAsPristine();
        this.form.markAsUntouched();
        this.form.disable();
        this.isEditing.set(false);
    }
}
