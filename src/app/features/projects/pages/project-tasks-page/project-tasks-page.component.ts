import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    OnInit,
    signal,
    Signal
} from '@angular/core';
import {ROUTER_OUTLET_DATA} from '@angular/router';

import {ProjectTaskCreateComponent} from '../../components/project-tasks-page-components/project-task-create/project-task-create.component';
import {ProjectTaskListComponent} from '../../components/project-tasks-page-components/project-task-list/project-task-list.component';
import {ProjectTaskToolbarComponent} from '../../components/project-tasks-page-components/project-task-toolbar/project-task-toolbar.component';
import {Project} from '../../interfaces/project.interface';
import {ProjectTask} from '../../interfaces/project-tasks.interface';
import {ProjectTasksService} from '../../services/project-tasks.service';
import {ProjectOutletData} from '../../../../shared/interfaces/project-outlet-data.interface';
import {finalize} from 'rxjs';

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

    protected readonly tasks = signal<ProjectTask[]>([]);
    protected readonly selectedStageId = signal<string | null>(null);
    protected readonly searchQuery = signal('');
    readonly isLoading = signal(false);

    protected readonly filteredTasks = computed(() => {
        const selectedStageId = this.selectedStageId();
        const query = this.searchQuery().trim().toLowerCase();

        return this.tasks().filter(task => {
            const matchesStage =
                !selectedStageId || task.workflowStageId === selectedStageId;

            const matchesSearch =
                !query || task.title.toLowerCase().includes(query);

            return matchesStage && matchesSearch;
        });
    });

    ngOnInit(): void {
        const projectId = this.projectId();

        if (!projectId) {
            return;
        }
        this.isLoading.set(true);

        this.projectTasksService
            .getAllTasks(projectId)
            .pipe(
                finalize(() => {
                    this.isLoading.set(false);
                })
            )
            .subscribe(tasks => {
                this.tasks.set(tasks);
            });
    }

    protected updateProject(project: Project): void {
        this.outletData()?.updateProject(project);
    }

    protected addTask(task: ProjectTask): void {
        this.tasks.update(tasks => [task, ...tasks]);
    }

    protected selectStage(stageId: string | null): void {
        this.selectedStageId.set(stageId);
    }

    protected searchTasks(query: string): void {
        this.searchQuery.set(query);
    }
}
