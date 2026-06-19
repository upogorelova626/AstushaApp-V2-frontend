import {HttpErrorResponse} from '@angular/common/http';
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
import {Router} from '@angular/router';
import {TuiAutoFocus, TuiDay} from '@taiga-ui/cdk';
import {
    TUI_VALIDATION_ERRORS,
    TuiButton,
    TuiCalendar,
    TuiDataList,
    type TuiDialogContext,
    TuiDialogService,
    TuiDropdown,
    TuiError,
    TuiInput,
    TuiLabel,
    TuiOption,
    TuiTextfield,
    TuiTitle
} from '@taiga-ui/core';
import {TuiChevron, TuiInputDate, TuiUnfinishedValidator} from '@taiga-ui/kit';
import {injectContext} from '@taiga-ui/polymorpheus';
import {catchError, EMPTY} from 'rxjs';

import {
    deadlineAfterStartDateValidator,
    notPastDateValidator
} from '../../../../validators/project-dates.validator';
import {
    ProjectPriorityOption,
    WorkflowTypeOption
} from '../../../../interfaces/workflow-and-priority.interface';
import {CreateProjectRequest} from '../../../../interfaces/project.interface';
import {
    ProjectPriority,
    ProjectWorkflowType
} from '../../../../interfaces/project.enums';
import {ProjectsService} from '../../../../services/projects.service';
import {tuiDayToDateString} from '../../../../../../shared/utils/tui-day-to-date-string';
import {
    PROJECT_PRIORITY_OPTIONS,
    PROJECT_WORKFLOW_TYPE_OPTIONS
} from '../../../../constants/project-options';
import {VALIDATION_ERRORS} from '../../../../../../shared/constants/validation-errors';

@Component({
    selector: 'app-create-project-dialog',
    imports: [
        ReactiveFormsModule,
        TuiAutoFocus,
        TuiButton,
        TuiCalendar,
        TuiDataList,
        TuiDropdown,
        TuiError,
        TuiInput,
        TuiInputDate,
        TuiLabel,
        TuiOption,
        TuiTextfield,
        TuiTitle,
        TuiUnfinishedValidator,
        TuiChevron
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
    private readonly dialogs = inject(TuiDialogService);

    protected readonly workflowTypeOptions = PROJECT_WORKFLOW_TYPE_OPTIONS;
    protected readonly priorityOptions = PROJECT_PRIORITY_OPTIONS;

    protected readonly workflowDropdownOpen = signal(false);
    protected readonly priorityDropdownOpen = signal(false);

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

    protected toggleWorkflowDropdown(): void {
        this.priorityDropdownOpen.set(false);
        this.workflowDropdownOpen.update(open => !open);
    }

    protected togglePriorityDropdown(): void {
        this.workflowDropdownOpen.set(false);
        this.priorityDropdownOpen.update(open => !open);
    }

    protected closeWorkflowDropdown(): void {
        this.workflowDropdownOpen.set(false);
    }

    protected closePriorityDropdown(): void {
        this.priorityDropdownOpen.set(false);
    }

    protected selectWorkflowType(option: WorkflowTypeOption): void {
        this.setSelectValue(
            this.form.controls.workflowType,
            this.form.controls.workflowTypeTitle,
            option
        );

        this.closeWorkflowDropdown();
    }

    protected selectPriority(option: ProjectPriorityOption): void {
        this.setSelectValue(
            this.form.controls.priority,
            this.form.controls.priorityTitle,
            option
        );

        this.closePriorityDropdown();
    }

    protected createProject(): void {
        this.form.markAllAsTouched();

        if (this.form.invalid) {
            return;
        }

        const value = this.form.getRawValue();

        if (!this.hasRequiredValues(value)) {
            return;
        }

        const payload = this.buildCreateProjectPayload(value);

        this.projectsService
            .createProject(payload)
            .pipe(
                catchError(error => {
                    this.dialogs
                        .open(this.getErrorMessage(error), {
                            label: 'Ошибка создания проекта',
                            size: 's'
                        })
                        .subscribe();

                    return EMPTY;
                })
            )
            .subscribe(project => {
                this.context.$implicit.complete();
                void this.router.navigate(['dashboard/projects', project.id]);
            });
    }

    private setSelectValue<T>(
        valueControl: FormControl<T | null>,
        titleControl: FormControl<string>,
        option: {
            value: T;
            title: string;
        }
    ): void {
        valueControl.setValue(option.value);
        titleControl.setValue(option.title);

        valueControl.markAsDirty();
        valueControl.markAsTouched();

        titleControl.markAsDirty();
        titleControl.markAsTouched();
    }

    private hasRequiredValues(
        value: ReturnType<typeof this.form.getRawValue>
    ): value is ReturnType<typeof this.form.getRawValue> & {
        workflowType: ProjectWorkflowType;
        priority: ProjectPriority;
        startDate: TuiDay;
        deadline: TuiDay;
    } {
        return Boolean(
            value.workflowType &&
            value.priority &&
            value.startDate &&
            value.deadline
        );
    }

    private buildCreateProjectPayload(
        value: ReturnType<typeof this.form.getRawValue> & {
            workflowType: ProjectWorkflowType;
            priority: ProjectPriority;
            startDate: TuiDay;
            deadline: TuiDay;
        }
    ): CreateProjectRequest {
        return {
            title: value.title.trim(),
            key: value.key.trim(),
            description: value.description.trim(),
            workflowType: value.workflowType,
            priority: value.priority,
            startDate: tuiDayToDateString(value.startDate),
            deadline: tuiDayToDateString(value.deadline)
        };
    }

    private getErrorMessage(error: unknown): string {
        if (!(error instanceof HttpErrorResponse)) {
            return 'Не удалось создать проект. Попробуйте позже';
        }

        const messages = this.getBackendMessages(error);

        if (this.hasMessage(messages, 'Project with this key already exists')) {
            return 'Проект с таким ключом уже существует';
        }

        if (error.status === 0) {
            return 'Сервер недоступен. Проверьте подключение';
        }

        if (error.status >= 500) {
            return 'На сервере произошла ошибка. Попробуйте позже';
        }

        return 'Не удалось создать проект. Попробуйте позже';
    }

    private getBackendMessages(error: HttpErrorResponse): string[] {
        const message = error.error?.message;

        if (Array.isArray(message)) {
            return message.filter(
                (item): item is string => typeof item === 'string'
            );
        }

        if (typeof message === 'string') {
            return [message];
        }

        return [];
    }

    private hasMessage(messages: string[], searchValue: string): boolean {
        return messages.some(message =>
            message.toLowerCase().includes(searchValue.toLowerCase())
        );
    }
}
