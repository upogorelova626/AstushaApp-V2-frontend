import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    inject,
    OnInit,
    signal
} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {catchError, EMPTY, finalize, forkJoin, switchMap} from 'rxjs';

import {BoardsToolbarComponent} from '../components/boards-toolbar/boards-toolbar.component';
import {BoardColumnComponent} from '../components/board-column/board-column.component';
import {ProjectsService} from '../../../shared/services/projects.service';
import {Project} from '../../../shared/interfaces/project.interface';
import {ProjectTasksService} from '../../../shared/services/project-tasks.service';
import {
    ProjectBoardStage,
    ProjectBoardTask
} from '../../../shared/interfaces/board.interface';
import {UsersService} from '../../../shared/services/users.service';
import {AuthUser} from '../../../shared/interfaces/auth.interface';
import {ProjectMember} from '../../../shared/interfaces/project-member.interface';
import {TaskPriority} from '../../../shared/interfaces/project-tasks.interface';

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
    protected readonly selectedProject = signal<Project | null>(null);
    protected readonly selectedProjectMembers = signal<ProjectMember[]>([]);
    protected readonly selectedAssigneeId = signal<string | null>(null);
    protected readonly selectedPriority = signal<TaskPriority | null>(null);

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
        this.selectedAssigneeId.set(null);
        this.selectedPriority.set(null);

        if (!projectId) {
            this.boardStages.set([]);
            this.selectedProject.set(null);
            this.selectedProjectMembers.set([]);

            return;
        }

        this.isLoading.set(true);

        forkJoin({
            boardStages: this.projectsService.getProjectBoard(projectId),
            project: this.projectsService.getOneProject(projectId)
        })
            .pipe(
                finalize(() => {
                    this.isLoading.set(false);
                })
            )
            .subscribe(({boardStages, project}) => {
                this.boardStages.set(boardStages);
                this.selectedProject.set(project);
                this.selectedProjectMembers.set(project.members ?? []);
            });
    }

    protected getFilteredTasks(tasks: ProjectBoardTask[]): ProjectBoardTask[] {
        return [...tasks]
            .filter(task => {
                if (!this.onlyMine()) {
                    return true;
                }

                return task.assignee?.id === this.currentUser()?.id;
            })
            .filter(task => {
                const selectedAssigneeId = this.selectedAssigneeId();

                if (!selectedAssigneeId) {
                    return true;
                }

                return task.assignee?.id === selectedAssigneeId;
            })
            .filter(task => {
                const selectedPriority = this.selectedPriority();

                if (!selectedPriority) {
                    return true;
                }

                return task.priority === selectedPriority;
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

        const previousBoardStages = this.boardStages();

        this.moveTaskLocally(movedTask.id, targetStageId, event.currentIndex);

        this.projectTasksService
            .moveTask(projectId, movedTask.id, {
                workflowStageId: targetStageId,
                position: event.currentIndex
            })
            .pipe(
                switchMap(() => {
                    return this.projectsService.getProjectBoard(projectId);
                }),
                catchError(() => {
                    this.boardStages.set(previousBoardStages);

                    return EMPTY;
                })
            )
            .subscribe(boardStages => {
                this.boardStages.set(boardStages);
            });
    }

    protected onlyMineChanged(value: boolean): void {
        this.onlyMine.set(value);
    }

    protected assigneeSelected(assigneeId: string | null): void {
        this.selectedAssigneeId.set(assigneeId);
    }

    protected prioritySelected(priority: TaskPriority | null): void {
        this.selectedPriority.set(priority);
    }

    private moveTaskLocally(
        taskId: string,
        targetStageId: string,
        targetIndex: number
    ): void {
        const boardStages = this.boardStages().map(stage => {
            return {
                ...stage,
                tasks: [...stage.tasks]
            };
        });

        const sourceStage = boardStages.find(stage => {
            return stage.tasks.some(task => task.id === taskId);
        });

        const targetStage = boardStages.find(stage => {
            return stage.id === targetStageId;
        });

        if (!sourceStage || !targetStage) {
            return;
        }

        const sourceIndex = sourceStage.tasks.findIndex(task => {
            return task.id === taskId;
        });

        if (sourceIndex === -1) {
            return;
        }

        if (sourceStage.id === targetStage.id) {
            moveItemInArray(sourceStage.tasks, sourceIndex, targetIndex);

            sourceStage.tasks = this.updateTasksPositions(sourceStage.tasks);

            this.boardStages.set(boardStages);

            return;
        }

        const [movedTask] = sourceStage.tasks.splice(sourceIndex, 1);

        targetStage.tasks.splice(targetIndex, 0, {
            ...movedTask,
            workflowStageId: targetStageId,
            position: targetIndex
        });

        sourceStage.tasks = this.updateTasksPositions(sourceStage.tasks);
        targetStage.tasks = this.updateTasksPositions(targetStage.tasks);

        this.boardStages.set(boardStages);
    }

    private updateTasksPositions(
        tasks: ProjectBoardTask[]
    ): ProjectBoardTask[] {
        return tasks.map((task, index) => {
            return {
                ...task,
                position: index
            };
        });
    }
}
