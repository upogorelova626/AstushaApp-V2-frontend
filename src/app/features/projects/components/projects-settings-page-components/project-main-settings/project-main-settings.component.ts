import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    OnInit,
    signal
} from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import {TuiDay} from '@taiga-ui/cdk';
import {
    TUI_VALIDATION_ERRORS,
    TuiButton,
    TuiCalendar,
    TuiDataListComponent,
    TuiDropdown,
    TuiError,
    TuiInput,
    TuiOption,
    TuiTextfield,
    TuiTitle
} from '@taiga-ui/core';
import {TuiChevron, TuiInputDateDirective, TuiTextarea} from '@taiga-ui/kit';
import {finalize, take} from 'rxjs';

import {VALIDATION_ERRORS} from '../../../../../shared/constants/validation-errors';
import {
    PROJECT_PRIORITY_OPTIONS,
    PROJECT_WORKFLOW_TYPE_OPTIONS
} from '../../../constants/project-options';
import {
    ProjectPriority,
    ProjectWorkflowType
} from '../../../interfaces/project.enums';
import {
    ProjectSettingsFormValue,
    UpdateProjectRequest
} from '../../../interfaces/project.interface';
import {ProjectsService} from '../../../services/projects.service';
import {
    deadlineAfterStartDateValidator,
    notPastDateValidator
} from '../../../validators/project-dates.validator';

interface SelectOption<T> {
    value: T;
    title: string;
    description: string;
}

@Component({
    selector: 'app-project-main-settings',
    imports: [
        ReactiveFormsModule,
        TuiButton,
        TuiCalendar,
        TuiChevron,
        TuiDataListComponent,
        TuiDropdown,
        TuiError,
        TuiInput,
        TuiInputDateDirective,
        TuiOption,
        TuiTextarea,
        TuiTextfield,
        TuiTitle
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

    private readonly projectsService = inject(ProjectsService);

    protected readonly isEditing = signal(false);
    protected readonly isSaving = signal(false);
    protected readonly isFormLoading = signal(true);

    protected readonly workflowTypeOptions = PROJECT_WORKFLOW_TYPE_OPTIONS;
    protected readonly priorityOptions = PROJECT_PRIORITY_OPTIONS;

    private initialFormValue: ProjectSettingsFormValue | null = null;

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

            workflowTypeTitle: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required]
            }),

            priority: new FormControl<ProjectPriority | null>(null, [
                Validators.required
            ]),

            priorityTitle: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required]
            }),

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

    ngOnInit() {
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
                    description: project.description ?? '',
                    workflowType: project.workflowType,
                    workflowTypeTitle: this.getWorkflowTypeTitle(
                        project.workflowType
                    ),
                    priority: project.priority,
                    priorityTitle: this.getPriorityTitle(project.priority),
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

    protected saveChanges() {
        if (this.form.invalid || this.isSaving()) {
            this.form.markAllAsTouched();

            return;
        }

        const rawValue = this.form.getRawValue();

        if (
            !rawValue.workflowType ||
            !rawValue.priority ||
            !rawValue.startDate ||
            !rawValue.deadline
        ) {
            this.form.markAllAsTouched();

            return;
        }

        const payload: UpdateProjectRequest = {
            title: rawValue.title.trim(),
            description: rawValue.description.trim(),
            workflowType: rawValue.workflowType,
            priority: rawValue.priority,
            startDate: this.toBackendDate(rawValue.startDate),
            deadline: this.toBackendDate(rawValue.deadline)
        };

        this.isSaving.set(true);

        this.projectsService
            .updateProject(this.projectId(), payload)
            .pipe(
                take(1),
                finalize(() => {
                    this.isSaving.set(false);
                })
            )
            .subscribe(() => {
                const formValue: ProjectSettingsFormValue = {
                    title: payload.title,
                    description: payload.description,
                    workflowType: payload.workflowType,
                    workflowTypeTitle: rawValue.workflowTypeTitle,
                    priority: payload.priority,
                    priorityTitle: rawValue.priorityTitle,
                    startDate: rawValue.startDate,
                    deadline: rawValue.deadline
                };

                this.initialFormValue = formValue;
                this.form.patchValue(formValue);

                this.form.markAsPristine();
                this.form.markAsUntouched();
                this.form.disable();
                this.isEditing.set(false);
            });
    }

    protected selectWorkflowType(option: SelectOption<ProjectWorkflowType>) {
        this.form.controls.workflowType.setValue(option.value);
        this.form.controls.workflowTypeTitle.setValue(option.title);

        this.form.controls.workflowType.markAsDirty();
        this.form.controls.workflowType.markAsTouched();

        this.form.controls.workflowTypeTitle.markAsDirty();
        this.form.controls.workflowTypeTitle.markAsTouched();
    }

    protected selectPriority(option: SelectOption<ProjectPriority>) {
        this.form.controls.priority.setValue(option.value);
        this.form.controls.priorityTitle.setValue(option.title);

        this.form.controls.priority.markAsDirty();
        this.form.controls.priority.markAsTouched();

        this.form.controls.priorityTitle.markAsDirty();
        this.form.controls.priorityTitle.markAsTouched();
    }

    private getWorkflowTypeTitle(workflowType: ProjectWorkflowType) {
        return (
            this.workflowTypeOptions.find(
                option => option.value === workflowType
            )?.title ?? ''
        );
    }

    private getPriorityTitle(priority: ProjectPriority) {
        return (
            this.priorityOptions.find(option => option.value === priority)
                ?.title ?? ''
        );
    }

    private toTuiDay(date: string | null): TuiDay | null {
        if (!date) {
            return null;
        }

        return TuiDay.fromLocalNativeDate(new Date(date));
    }

    private toBackendDate(date: TuiDay): string {
        const year = date.year;
        const month = String(date.month + 1).padStart(2, '0');
        const day = String(date.day).padStart(2, '0');

        return `${year}-${month}-${day}T00:00:00.000Z`;
    }
}
