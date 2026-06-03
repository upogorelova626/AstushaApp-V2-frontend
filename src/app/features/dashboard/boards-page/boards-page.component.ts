import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal
} from '@angular/core';
import {finalize, forkJoin} from 'rxjs';
import {TuiSkeleton} from '@taiga-ui/kit';

import {BoardsToolbarComponent} from '../components/boards-toolbar/boards-toolbar.component';
import {BoardColumnComponent} from '../components/board-column/board-column.component';
import {ProjectsService} from '../../projects/services/projects.service';
import {Project} from '../../projects/interfaces/project.interface';
import {ProjectTasksService} from '../../projects/services/project-tasks.service';
import {ProjectTask} from '../../projects/interfaces/project-tasks.interface';

@Component({
    selector: 'app-boards-page',
    imports: [BoardsToolbarComponent, BoardColumnComponent, TuiSkeleton],
    templateUrl: './boards-page.component.html',
    styleUrl: './boards-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardsPageComponent implements OnInit {
    private readonly projectsService = inject(ProjectsService);
    private readonly projectTasksService = inject(ProjectTasksService);

    protected readonly projects = signal<Project[]>([]);
    protected readonly projectTasks = signal<ProjectTask[]>([]);
    protected readonly selectedProjectId = signal<string | null>(null);
    protected readonly selectedProject = signal<Project | null>(null);
    protected readonly isLoading = signal(false);

    ngOnInit(): void {
        this.isLoading.set(true);

        this.projectsService
            .getProjects()
            .pipe(
                finalize(() => {
                    this.isLoading.set(false);
                })
            )
            .subscribe(projects => {
                this.projects.set(projects);
            });
    }

    protected selectProject(projectId: string | null) {
        this.selectedProjectId.set(projectId);

        if (!projectId) {
            this.selectedProject.set(null);
            this.projectTasks.set([]);

            return;
        }

        this.isLoading.set(true);

        forkJoin({
            project: this.projectsService.getOneProject(projectId),
            tasks: this.projectTasksService.getAllTasks(projectId)
        })
            .pipe(
                finalize(() => {
                    this.isLoading.set(false);
                })
            )
            .subscribe(({project, tasks}) => {
                this.selectedProject.set(project);
                this.projectTasks.set(tasks);
            });
    }

    protected getTasksByStage(stageId: string) {
        return this.projectTasks().filter(task => {
            return task.workflowStageId === stageId;
        });
    }
}
