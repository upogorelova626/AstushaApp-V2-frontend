import {
    ChangeDetectionStrategy,
    Component,
    inject,
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
    type TuiDialogContext,
    TuiDropdown,
    TuiError,
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
import {injectContext} from '@taiga-ui/polymorpheus';
import {catchError, EMPTY, finalize} from 'rxjs';
import {VALIDATION_ERRORS} from '../../../../../../shared/constants/validation-errors';
import {tuiDayToDateString} from '../../../../../../shared/utils/tui-day-to-date-string';
import {
    SelectOption,
    TASK_PRIORITY_ITEMS,
    TASK_TYPE_ITEMS
} from '../../../../../projects/constants/project-task-create-form.const';
import {
    ProjectTask,
    TaskPriority,
    TaskType,
    UpdateProjectTaskRequest
} from '../../../../../projects/interfaces/project-tasks.interface';
import {ProjectTasksService} from '../../../../../projects/services/project-tasks.service';
import {ProjectsService} from '../../../../../projects/services/projects.service';
import {notPastDateValidator} from '../../../../../projects/validators/project-dates.validator';

const EMPTY_ASSIGNEE_LABEL = 'Без исполнителя';

const EMPTY_ASSIGNEE_OPTION: SelectOption<string> = {
    label: EMPTY_ASSIGNEE_LABEL,
    value: ''
};

@Component({
    selector: 'app-edit-task-dialog',
    imports: [
        ReactiveFormsModule,
        TuiButton,
        TuiCalendar,
        TuiChevron,
        TuiDataList,
        TuiDropdown,
        TuiError,
        TuiInput,
        TuiInputDate,
        TuiTextarea,
        TuiTextfield,
        TuiDataListWrapperComponent
    ],
    templateUrl: './edit-task-dialog.component.html',
    styleUrl: './edit-task-dialog.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: TUI_VALIDATION_ERRORS,
            useValue: VALIDATION_ERRORS
        },
        tuiItemsHandlersProvider({
            stringify: signal((item: unknown) => String(item ?? ''))
        })
    ]
})
export class EditTaskDialogComponent {
    private readonly projectTasksService = inject(ProjectTasksService);
    private readonly projectsService = inject(ProjectsService);

    protected readonly context =
        injectContext<TuiDialogContext<ProjectTask, ProjectTask>>();

    protected readonly task = this.context.data;

    protected readonly isSaving = signal(false);
    protected readonly isAssigneesLoading = signal(false);

    protected readonly taskTypeItems = TASK_TYPE_ITEMS.map(item => item.label);
    protected readonly taskPriorityItems = TASK_PRIORITY_ITEMS.map(
        item => item.label
    );

    protected readonly assigneeIdItems = signal<string[]>([
        EMPTY_ASSIGNEE_LABEL
    ]);

    private readonly assigneeOptions = signal<SelectOption<string>[]>([
        EMPTY_ASSIGNEE_OPTION
    ]);

    protected readonly form = new FormGroup({
        title: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(200)
            ]
        }),

        description: new FormControl('', {
            nonNullable: true,
            validators: [Validators.maxLength(3000)]
        }),

        type: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),

        priority: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),

        assigneeId: new FormControl(EMPTY_ASSIGNEE_LABEL, {
            nonNullable: true
        }),

        storyPoints: new FormControl<number | null>(null, {
            validators: [Validators.min(0)]
        }),

        dueDate: new FormControl<TuiDay | null>(null, {
            validators: [notPastDateValidator]
        })
    });

    constructor() {
        this.form.patchValue({
            title: this.task.title,
            description: this.task.description ?? '',
            type: this.getTaskTypeLabel(this.task.type),
            priority: this.getTaskPriorityLabel(this.task.priority),
            assigneeId: EMPTY_ASSIGNEE_LABEL,
            storyPoints: this.task.storyPoints ?? null,
            dueDate: this.toTuiDay(this.task.dueDate)
        });

        this.loadAssignees();
    }

    protected saveTask(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();

            return;
        }

        this.isSaving.set(true);

        this.projectTasksService
            .editTask(
                this.task.projectId,
                this.task.id,
                this.buildUpdateTaskPayload()
            )
            .pipe(
                catchError(() => EMPTY),
                finalize(() => {
                    this.isSaving.set(false);
                })
            )
            .subscribe(task => {
                this.context.completeWith(task);
            });
    }

    private loadAssignees(): void {
        this.isAssigneesLoading.set(true);

        this.projectsService
            .getProjectMembers(this.task.projectId)
            .pipe(
                catchError(() => EMPTY),
                finalize(() => {
                    this.isAssigneesLoading.set(false);
                })
            )
            .subscribe(members => {
                const assigneeOptions: SelectOption<string>[] = [
                    EMPTY_ASSIGNEE_OPTION,
                    ...members.map(member => ({
                        label:
                            `${member.user.firstName ?? ''} ${member.user.lastName ?? ''}`.trim() ||
                            member.user.login,
                        value: member.user.id
                    }))
                ];

                this.assigneeOptions.set(assigneeOptions);
                this.assigneeIdItems.set(
                    assigneeOptions.map(option => option.label)
                );

                this.form.controls.assigneeId.setValue(
                    this.getAssigneeLabel(this.task.assigneeId)
                );
            });
    }

    private buildUpdateTaskPayload(): UpdateProjectTaskRequest {
        const formValue = this.form.getRawValue();

        return {
            title: formValue.title.trim(),
            description: formValue.description.trim() || null,
            type: this.getTaskTypeValue(formValue.type),
            priority: this.getTaskPriorityValue(formValue.priority),
            assigneeId: this.getAssigneeId(formValue.assigneeId),
            storyPoints: formValue.storyPoints,
            dueDate: formValue.dueDate
                ? tuiDayToDateString(formValue.dueDate)
                : null
        };
    }

    private getTaskTypeLabel(type: TaskType): string {
        return TASK_TYPE_ITEMS.find(item => item.value === type)?.label ?? '';
    }

    private getTaskPriorityLabel(priority: TaskPriority): string {
        return (
            TASK_PRIORITY_ITEMS.find(item => item.value === priority)?.label ??
            ''
        );
    }

    private getTaskTypeValue(label: string): TaskType | undefined {
        return TASK_TYPE_ITEMS.find(item => item.label === label)?.value;
    }

    private getTaskPriorityValue(label: string): TaskPriority | undefined {
        return TASK_PRIORITY_ITEMS.find(item => item.label === label)?.value;
    }

    private getAssigneeLabel(assigneeId: string | null): string {
        if (!assigneeId) {
            return EMPTY_ASSIGNEE_LABEL;
        }

        return (
            this.assigneeOptions().find(option => option.value === assigneeId)
                ?.label ?? EMPTY_ASSIGNEE_LABEL
        );
    }

    private getAssigneeId(label: string): string | null {
        const assigneeId =
            this.assigneeOptions().find(option => option.label === label)
                ?.value ?? '';

        return assigneeId || null;
    }

    private toTuiDay(date: string | null): TuiDay | null {
        if (!date) {
            return null;
        }

        const [year, month, day] = date.split('T')[0].split('-').map(Number);

        return new TuiDay(year, month - 1, day);
    }
}
