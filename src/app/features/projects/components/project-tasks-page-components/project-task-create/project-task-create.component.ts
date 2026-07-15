import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    output,
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
    TuiDataList,
    TuiDropdown,
    TuiError,
    TuiIcon,
    TuiInput,
    TuiTextfield,
    tuiItemsHandlersProvider
} from '@taiga-ui/core';
import {
    TuiChevron,
    TuiDataListWrapperComponent,
    TuiInputDate,
    TuiTextarea
} from '@taiga-ui/kit';
import {finalize} from 'rxjs';

import {VALIDATION_ERRORS} from '../../../../../shared/constants/validation-errors';
import {tuiDayToDateString} from '../../../../../shared/utils/tui-day-to-date-string';
import {
    SelectOption,
    TASK_PRIORITY_ITEMS,
    TASK_TYPE_ITEMS
} from '../../../constants/project-task-create-form.const';
import {Project} from '../../../../../shared/interfaces/project.interface';
import {
    CreateProjectTaskRequest,
    ProjectTask,
    TaskPriority,
    TaskType
} from '../../../../../shared/interfaces/project-tasks.interface';
import {ProjectTasksService} from '../../../../../shared/services/project-tasks.service';
import {notPastDateValidator} from '../../../validators/project-dates.validator';

@Component({
    selector: 'app-project-task-create',
    imports: [
        ReactiveFormsModule,
        TuiButton,
        TuiCalendar,
        TuiChevron,
        TuiDataList,
        TuiDropdown,
        TuiError,
        TuiIcon,
        TuiInput,
        TuiInputDate,
        TuiTextarea,
        TuiTextfield,
        TuiDataListWrapperComponent
    ],
    templateUrl: './project-task-create.component.html',
    styleUrl: './project-task-create.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: TUI_VALIDATION_ERRORS,
            useValue: VALIDATION_ERRORS
        },
        tuiItemsHandlersProvider({
            stringify: signal((item: unknown) => {
                if (item && typeof item === 'object' && 'label' in item) {
                    return String((item as {label: unknown}).label);
                }

                return '';
            })
        })
    ]
})
export class ProjectTaskCreateComponent {
    private readonly projectTasksService = inject(ProjectTasksService);

    readonly project = input.required<Project>();
    readonly tasks = input.required<ProjectTask[]>();
    readonly taskCreated = output<ProjectTask>();

    protected readonly isCreating = signal(false);

    protected readonly taskTypeItems = TASK_TYPE_ITEMS;
    protected readonly taskPriorityItems = TASK_PRIORITY_ITEMS;

    protected readonly workflowStageIdItems = computed<SelectOption<string>[]>(
        () =>
            this.project().workflowStages.map(stage => ({
                label: stage.name,
                value: stage.id
            }))
    );

    protected readonly assigneeIdItems = computed<SelectOption<string>[]>(() =>
        this.project().members.map(member => ({
            label:
                `${member.user.firstName ?? ''} ${member.user.lastName ?? ''}`.trim() ||
                member.user.login,
            value: member.user.id
        }))
    );

    protected readonly sprintIdItems = signal<SelectOption<string>[]>([]);

    protected readonly parentIdItems = computed<SelectOption<string>[]>(() =>
        this.tasks().map(task => ({
            label: `#${task.number} ${task.title}`,
            value: task.id
        }))
    );

    protected readonly form = new FormGroup({
        title: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(200)
            ]
        }),

        workflowStageId: new FormControl<SelectOption<string> | string | null>(
            null,
            {
                validators: [Validators.required]
            }
        ),

        description: new FormControl('', {
            nonNullable: true,
            validators: [Validators.maxLength(3000)]
        }),

        type: new FormControl<SelectOption<TaskType> | null>(null, {
            validators: [Validators.required]
        }),

        priority: new FormControl<SelectOption<TaskPriority> | null>(null, {
            validators: [Validators.required]
        }),

        storyPoints: new FormControl<number | null>(null, {
            validators: [Validators.min(0)]
        }),

        dueDate: new FormControl<TuiDay | null>(null, {
            validators: [notPastDateValidator]
        }),

        assigneeId: new FormControl<SelectOption<string> | string | null>(null),

        sprintId: new FormControl<SelectOption<string> | null>(null),

        parentId: new FormControl<SelectOption<string> | null>(null)
    });

    protected clearForm() {
        this.form.reset({
            title: '',
            workflowStageId: null,
            description: '',
            type: null,
            priority: null,
            storyPoints: null,
            dueDate: null,
            assigneeId: null,
            sprintId: null,
            parentId: null
        });
    }

    protected createTask() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();

            return;
        }

        const formValue = this.form.getRawValue();

        const selectedAssignee =
            typeof formValue.assigneeId === 'string'
                ? this.assigneeIdItems().find(
                      assignee => assignee.label === formValue.assigneeId
                  )
                : formValue.assigneeId;
        const selectedWorkflowStage =
            typeof formValue.workflowStageId === 'string'
                ? this.workflowStageIdItems().find(
                      stage => stage.label === formValue.workflowStageId
                  )
                : formValue.workflowStageId;

        const payload: CreateProjectTaskRequest = {
            title: formValue.title.trim(),
            workflowStageId: selectedWorkflowStage?.value,
            description: formValue.description.trim() || undefined,
            type: formValue.type?.value,
            priority: formValue.priority?.value,
            storyPoints: formValue.storyPoints ?? undefined,
            dueDate: formValue.dueDate
                ? tuiDayToDateString(formValue.dueDate)
                : undefined,
            assigneeId: selectedAssignee?.value || undefined,
            sprintId: formValue.sprintId?.value || undefined,
            parentId: formValue.parentId?.value || undefined
        };

        this.isCreating.set(true);

        this.projectTasksService
            .createTask(payload, this.project().id)
            .pipe(finalize(() => this.isCreating.set(false)))
            .subscribe(task => {
                this.taskCreated.emit(task);
                this.clearForm();
            });
    }
}
