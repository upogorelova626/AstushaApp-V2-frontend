import {
    Component,
    ChangeDetectionStrategy,
    inject,
    computed,
    Signal,
    OnInit,
    signal
} from '@angular/core';
import {ProjectTaskCreateComponent} from '../../components/project-tasks-page-components/project-task-create/project-task-create.component';
import {ROUTER_OUTLET_DATA} from '@angular/router';
import {Project} from '../../interfaces/project.interface';
import {ProjectOutletData} from '../../../../shared/interfaces/project-outlet-data.interface';
import {ProjectTasksService} from '../../services/project-tasks.service';
import {ProjectTask} from '../../interfaces/project-tasks.interface';
import {ProjectTaskToolbarComponent} from '../../components/project-tasks-page-components/project-task-toolbar/project-task-toolbar.component';
import {ProjectTaskListComponent} from '../../components/project-tasks-page-components/project-task-list/project-task-list.component';

@Component({
    selector: 'app-project-tasks-page',
    imports: [
        ProjectTaskCreateComponent,
        ProjectTaskToolbarComponent,
        ProjectTaskListComponent
    ],
    templateUrl: './project-tasks-page.component.html',
    styleUrl: './project-tasks-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectTasksPageComponent implements OnInit {
    private readonly projectTasksService = inject(ProjectTasksService);

    private readonly outletData = inject(
        ROUTER_OUTLET_DATA
    ) as Signal<ProjectOutletData | null>;

    protected readonly project = computed(
        () => this.outletData()?.project ?? null
    );
    protected readonly projectId = computed(
        () => this.outletData()?.projectId ?? null
    );

    protected updateProject(project: Project) {
        this.outletData()?.updateProject(project);
    }

    protected readonly tasks = signal<ProjectTask[]>([]);
    protected readonly selectedStageId = signal<string | null>(null);

    ngOnInit() {
        const projectId = this.projectId();
        if (!projectId) {
            return;
        }
        this.projectTasksService
            .getAllTasks(projectId)
            .subscribe(tasks => this.tasks.set(tasks));
    }

    protected addTask(task: ProjectTask) {
        this.tasks.update(tasks => [task, ...tasks]);
    }

    protected selectStage(stageId: string | null) {
        this.selectedStageId.set(stageId);
    }

    protected readonly filteredTasks = computed(() => {
        const selectedStageId = this.selectedStageId();

        if (!selectedStageId) {
            return this.tasks();
        }

        return this.tasks().filter(
            task => task.workflowStageId === selectedStageId
        );
    });
}
