import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    inject,
    OnInit,
    signal
} from '@angular/core';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {finalize, switchMap} from 'rxjs';

import {BoardsToolbarComponent} from '../components/boards-toolbar/boards-toolbar.component';
import {BoardColumnComponent} from '../components/board-column/board-column.component';
import {ProjectsService} from '../../projects/services/projects.service';
import {Project} from '../../projects/interfaces/project.interface';
import {ProjectTasksService} from '../../projects/services/project-tasks.service';
import {
    ProjectBoardStage,
    ProjectBoardTask
} from '../../projects/interfaces/board.interface';
import {UsersService} from '../../users/services/users.service';
import {AuthUser} from '../../auth/models/interfaces/auth.interface';

@Component({
    selector: 'app-boards-page',
    imports: [BoardsToolbarComponent, BoardColumnComponent],
    templateUrl: './boards-page.component.html',
    styleUrl: './boards-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardsPageComponent implements OnInit {
    private readonly projectsService = inject(ProjectsService);
    private readonly projectTasksService = inject(ProjectTasksService);
    private readonly usersService = inject(UsersService);
    private readonly destroyRef = inject(DestroyRef);

    protected readonly projects = signal<Project[]>([]);
    protected readonly boardStages = signal<ProjectBoardStage[]>([]);

    protected readonly selectedProjectId = signal<string | null>(null);

    protected readonly onlyMine = signal(false);
    protected readonly isLoading = signal(false);

    private readonly currentUser = signal<AuthUser | null>(null);

    protected readonly dropListIds = computed(() => {
        return this.boardStages().map(stage => {
            return `board-stage-${stage.id}`;
        });
    });

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

        this.usersService.profile$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(profile => {
                this.currentUser.set(profile);
            });
    }

    protected selectProject(projectId: string | null): void {
        this.selectedProjectId.set(projectId);

        if (!projectId) {
            this.boardStages.set([]);

            return;
        }

        this.isLoading.set(true);

        this.projectsService
            .getProjectBoard(projectId)
            .pipe(
                finalize(() => {
                    this.isLoading.set(false);
                })
            )
            .subscribe(boardStages => {
                this.boardStages.set(boardStages);
            });
    }

    protected getFilteredTasks(tasks: ProjectBoardTask[]): ProjectBoardTask[] {
        return tasks
            .filter(task => {
                if (!this.onlyMine()) {
                    return true;
                }

                return task.assignee?.id === this.currentUser()?.id;
            })
            .sort((a, b) => {
                return a.position - b.position;
            });
    }

    protected moveTask(
        event: CdkDragDrop<ProjectBoardTask[]>,
        targetStageId: string
    ): void {
        const projectId = this.selectedProjectId();
        const movedTask = event.item.data as ProjectBoardTask;

        if (!projectId) {
            return;
        }

        this.projectTasksService
            .moveTask(projectId, movedTask.id, {
                workflowStageId: targetStageId,
                position: event.currentIndex
            })
            .pipe(
                switchMap(() => {
                    return this.projectsService.getProjectBoard(projectId);
                })
            )
            .subscribe(boardStages => {
                this.boardStages.set(boardStages);
            });
    }

    protected onlyMineChanged(value: boolean): void {
        this.onlyMine.set(value);
    }
}
