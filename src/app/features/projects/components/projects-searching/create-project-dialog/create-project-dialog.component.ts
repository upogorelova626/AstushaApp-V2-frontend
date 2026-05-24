import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    signal
} from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import {TuiActiveZone, TuiAutoFocus, TuiDay, TuiObscured} from '@taiga-ui/cdk';
import {
    TUI_VALIDATION_ERRORS,
    TuiButton,
    TuiCalendar,
    TuiDataList,
    type TuiDialogContext,
    TuiDropdown,
    TuiInput,
    TuiLabel,
    TuiOption,
    TuiTextfield,
    TuiTitle,
    TuiError
} from '@taiga-ui/core';
import {TuiChevron, TuiInputDate, TuiUnfinishedValidator} from '@taiga-ui/kit';
import {injectContext} from '@taiga-ui/polymorpheus';

import {
    deadlineAfterStartDateValidator,
    notPastDateValidator
} from '../../../validators/project-dates.validator';
import {
    WorkflowTypeOption,
    ProjectPriorityOption
} from '../../../interfaces/workflow-and-priority.interface';
import {
    CreateProjectRequest,
    ProjectPriority,
    ProjectWorkflowType
} from '../../../interfaces/projects.interface';
import {ProjectsService} from '../../../services/projects.service';
import {tuiDayToDateString} from '../../../../../shared/utils/tui-day-to-date-string';
import {
    PROJECT_WORKFLOW_TYPE_OPTIONS,
    PROJECT_PRIORITY_OPTIONS
} from '../../../constants/project-options';
import {VALIDATION_ERRORS} from '../../../../../shared/constants/validation-errors';
import {Router} from '@angular/router';

@Component({
    selector: 'app-create-project-dialog',
    imports: [
        ReactiveFormsModule,
        TuiActiveZone,
        TuiAutoFocus,
        TuiObscured,
        TuiButton,
        TuiCalendar,
        TuiDataList,
        TuiDropdown,
        TuiInput,
        TuiInputDate,
        TuiLabel,
        TuiOption,
        TuiTextfield,
        TuiTitle,
        TuiUnfinishedValidator,
        TuiChevron,
        TuiError
    ],
    templateUrl: './create-project-dialog.component.html',
    styleUrl: './create-project-dialog.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: TUI_VALIDATION_ERRORS,
            useValue: VALIDATION_ERRORS
        }
    ]
})
export class CreateProjectDialogComponent {
    protected readonly context = injectContext<TuiDialogContext<void, void>>();

    private readonly projectsService = inject(ProjectsService);
    private readonly router = inject(Router);

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

            key: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(10),
                    Validators.pattern(/^[A-Z][A-Z0-9_]*$/)
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

    protected readonly workflowTypeOptions = PROJECT_WORKFLOW_TYPE_OPTIONS;
    protected readonly priorityOptions = PROJECT_PRIORITY_OPTIONS;

    protected readonly isWorkflowDropdownOpen = signal(false);
    protected readonly isPriorityDropdownOpen = signal(false);

    protected readonly selectedWorkflowType = signal<WorkflowTypeOption | null>(
        null
    );
    protected readonly selectedPriority = signal<ProjectPriorityOption | null>(
        null
    );

    protected readonly workflowButtonLabel = computed(
        () =>
            this.selectedWorkflowType()?.title ??
            'Выберите тип рабочего процесса'
    );
    protected readonly priorityButtonLabel = computed(
        () => this.selectedPriority()?.title ?? 'Выберите приоритет проекта'
    );

    protected toggleWorkflowDropdown() {
        this.isWorkflowDropdownOpen.update(open => !open);
    }
    protected onWorkflowObscured(obscured: boolean) {
        if (obscured) {
            this.isWorkflowDropdownOpen.set(false);
        }
    }
    protected onWorkflowActiveZoneChange(active: boolean) {
        if (!active) {
            this.isWorkflowDropdownOpen.set(false);
        }
    }
    protected selectWorkflowType(option: WorkflowTypeOption) {
        this.selectedWorkflowType.set(option);
        this.form.controls.workflowType.setValue(option.value);
        this.form.controls.workflowType.markAsTouched();
        this.isWorkflowDropdownOpen.set(false);
    }

    protected togglePriorityDropdown() {
        this.isPriorityDropdownOpen.update(open => !open);
    }
    protected onPriorityObscured(obscured: boolean) {
        if (obscured) {
            this.isPriorityDropdownOpen.set(false);
        }
    }
    protected onPriorityActiveZoneChange(active: boolean) {
        if (!active) {
            this.isPriorityDropdownOpen.set(false);
        }
    }
    protected selectPriority(option: ProjectPriorityOption) {
        this.selectedPriority.set(option);
        this.form.controls.priority.setValue(option.value);
        this.form.controls.priority.markAsTouched();
        this.isPriorityDropdownOpen.set(false);
    }

    protected createProject() {
        this.form.markAllAsTouched();

        if (this.form.invalid) {
            return;
        }

        const value = this.form.getRawValue();

        const payload: CreateProjectRequest = {
            ...value,
            workflowType: value.workflowType!,
            priority: value.priority!,
            startDate: tuiDayToDateString(value.startDate!),
            deadline: tuiDayToDateString(value.deadline!)
        };
        this.projectsService.createProject(payload).subscribe(project => {
            this.context.$implicit.complete();
            this.router.navigate(['/projects', project.id]);
        });
    }
}
