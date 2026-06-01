import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output
} from '@angular/core';
import {ProjectTask} from '../../../interfaces/project-tasks.interface';
import {TuiButton, TuiInput} from '@taiga-ui/core';
import {Project} from '../../../interfaces/project.interface';

@Component({
    selector: 'app-project-task-toolbar',
    imports: [TuiButton, TuiInput],
    templateUrl: './project-task-toolbar.component.html',
    styleUrl: './project-task-toolbar.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectTaskToolbarComponent {
    readonly tasks = input.required<ProjectTask[]>();
    readonly project = input.required<Project>();

    readonly stageSelected = output<string | null>();

    protected readonly workflowStages = computed(() => {
        return this.project().workflowStages;
    });

    protected selectStage(stageId: string | null) {
        this.stageSelected.emit(stageId);
    }
}
