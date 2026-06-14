import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    input,
    output
} from '@angular/core';
import {ProjectTask} from '../../../interfaces/project-tasks.interface';
import {TuiButton, TuiInput} from '@taiga-ui/core';
import {Project} from '../../../interfaces/project.interface';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {startWith} from 'rxjs';
import {TuiSkeleton} from '@taiga-ui/kit';

@Component({
    selector: 'app-project-task-toolbar',
    imports: [TuiButton, TuiInput, ReactiveFormsModule, TuiSkeleton],
    templateUrl: './project-task-toolbar.component.html',
    styleUrl: './project-task-toolbar.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectTaskToolbarComponent {
    readonly tasks = input.required<ProjectTask[]>();
    readonly project = input.required<Project>();
    readonly isLoading = input<boolean>(false);

    readonly stageSelected = output<string | null>();
    readonly searchChanged = output<string>();

    protected readonly workflowStages = computed(() => {
        return this.project().workflowStages;
    });

    protected selectStage(stageId: string | null) {
        this.stageSelected.emit(stageId);
    }

    protected readonly search = new FormControl('', {nonNullable: true});

    protected readonly searchQuery = toSignal(
        this.search.valueChanges.pipe(startWith(this.search.value)),
        {
            initialValue: ''
        }
    );

    constructor() {
        effect(() => {
            this.searchChanged.emit(this.searchQuery().trim());
        });
    }

    protected getStageTasksCount(stageId: string) {
        const tasks = this.tasks();

        return tasks.filter(task => task.workflowStageId === stageId).length;
    }
}
