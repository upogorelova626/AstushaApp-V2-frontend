import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
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
import {PROJECT_PRIORITY_OPTIONS} from '../../../constants/project-options';
import {ProjectPriority} from '../../../interfaces/project.enums';
import {
    Project,
    ProjectListItem,
    ProjectSettingsFormValue,
    UpdateProjectRequest
} from '../../../interfaces/project.interface';
import {ProjectsService} from '../../../services/projects.service';
import {
    deadlineAfterStartDateValidator,
    notPastDateValidator
} from '../../../validators/project-dates.validator';
import {TuiSkeleton} from '@taiga-ui/kit';
import {tuiDayToDateString} from '../../../../../shared/utils/tui-day-to-date-string';

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
        TuiTitle,
        TuiSkeleton
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
    readonly project = input.required<Project>();
    readonly projectUpdated = output<Project>();

    private readonly projectsService = inject(ProjectsService);

    protected readonly isEditing = signal(false);
    protected readonly isSaving = signal(false);
    protected readonly isFormLoading = signal(true);

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
                validators: [Validators.maxLength(1000)]
            }),

            priority: new FormControl<ProjectPriority>(ProjectPriority.MEDIUM, {
                nonNullable: true,
                validators: [Validators.required]
            }),

            priorityTitle: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required]
            }),

            startDate: new FormControl<TuiDay | null>(null, [
                notPastDateValidator
            ]),

            deadline: new FormControl<TuiDay | null>(null, [
                notPastDateValidator
            ])
        },
        {
            validators: [deadlineAfterStartDateValidator]
        }
    );

    ngOnInit() {
        this.form.disable();
        this.patchFormFromProject(this.project());
        this.isFormLoading.set(false);
    }

    protected startEditing() {
        this.isEditing.set(true);
        this.form.enable();
    }

    protected cancelEditing() {
        if (this.initialFormValue) {
            this.patchForm(this.initialFormValue);
        }

        this.disableEditingMode();
    }

    protected saveChanges() {
        if (this.form.invalid || this.isSaving()) {
            this.form.markAllAsTouched();

            return;
        }

        const rawValue = this.form.getRawValue();

        const payload: UpdateProjectRequest = {
            title: rawValue.title.trim(),
            description: rawValue.description.trim() || undefined,
            priority: rawValue.priority,
            startDate: rawValue.startDate
                ? tuiDayToDateString(rawValue.startDate)
                : undefined,
            deadline: rawValue.deadline
                ? tuiDayToDateString(rawValue.deadline)
                : undefined
        };

        this.isSaving.set(true);

        this.projectsService
            .updateProject(this.project().id, payload)
            .pipe(
                take(1),
                finalize(() => {
                    this.isSaving.set(false);
                })
            )
            .subscribe(updatedProject => {
                const formValue: ProjectSettingsFormValue = {
                    title: updatedProject.title,
                    description: updatedProject.description ?? '',

                    priority: updatedProject.priority,
                    priorityTitle: this.getOptionTitle(
                        this.priorityOptions,
                        updatedProject.priority
                    ),
                    startDate: this.toTuiDay(updatedProject.startDate),
                    deadline: this.toTuiDay(updatedProject.deadline)
                };

                this.initialFormValue = formValue;
                this.patchForm(formValue);
                this.disableEditingMode();

                this.projectUpdated.emit(updatedProject);
            });
    }

    protected selectPriority(option: SelectOption<ProjectPriority>) {
        this.setSelectValue(
            this.form.controls.priority,
            this.form.controls.priorityTitle,
            option
        );
    }

    private patchFormFromProject(project: ProjectListItem) {
        const formValue: ProjectSettingsFormValue = {
            title: project.title,
            description: project.description ?? '',
            priority: project.priority,
            priorityTitle: this.getOptionTitle(
                this.priorityOptions,
                project.priority
            ),
            startDate: this.toTuiDay(project.startDate),
            deadline: this.toTuiDay(project.deadline)
        };

        this.initialFormValue = formValue;
        this.patchForm(formValue);
    }

    private patchForm(value: ProjectSettingsFormValue) {
        this.form.patchValue(value);
        this.form.markAsPristine();
        this.form.markAsUntouched();
    }

    private disableEditingMode() {
        this.form.markAsPristine();
        this.form.markAsUntouched();
        this.form.disable();
        this.isEditing.set(false);
    }

    private setSelectValue<T>(
        valueControl: FormControl<T>,
        titleControl: FormControl<string>,
        option: SelectOption<T>
    ) {
        valueControl.setValue(option.value);
        titleControl.setValue(option.title);

        valueControl.markAsDirty();
        valueControl.markAsTouched();

        titleControl.markAsDirty();
        titleControl.markAsTouched();
    }

    private getOptionTitle<T>(options: readonly SelectOption<T>[], value: T) {
        return options.find(option => option.value === value)?.title ?? '';
    }

    private toTuiDay(date: string | null): TuiDay | null {
        if (!date) {
            return null;
        }

        return TuiDay.fromLocalNativeDate(new Date(date));
    }
}
