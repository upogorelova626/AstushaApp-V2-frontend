import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    inject,
    signal
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {finalize} from 'rxjs';
import {ProjectTasksService} from '../../../../shared/services/project-tasks.service';
import {ProjectTask} from '../../../../shared/interfaces/project-tasks.interface';
import {TaskContentCardComponent} from '../../components/task-details-components/task-content-card/task-content-card.component';
import {TaskFilesCardComponent} from '../../components/task-details-components/task-files-card/task-files-card.component';
import {TaskMainCardComponent} from '../../components/task-details-components/task-main-card/task-main-card.component';
import {TaskCommentsComponent} from '../../components/task-details-components/task-comments/task-comments.component';
import {TaskDangerZoneComponent} from '../../components/task-details-components/task-danger-zone/task-danger-zone.component';

@Component({
    selector: 'app-task-page',
    imports: [
        TaskMainCardComponent,
        TaskContentCardComponent,
        TaskFilesCardComponent,
        TaskCommentsComponent,
        TaskDangerZoneComponent
    ],
    templateUrl: './task-page.component.html',
    styleUrl: './task-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskPageComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly projectTasksService = inject(ProjectTasksService);

    protected readonly task = signal<ProjectTask | null>(null);
    protected readonly isLoading = signal(false);

    ngOnInit() {
        const taskId = this.route.snapshot.paramMap.get('taskId');
        const projectId = this.route.snapshot.pathFromRoot
            .map(route => route.paramMap.get('projectId'))
            .find(Boolean);

        if (!taskId || !projectId) {
            return;
        }

        this.isLoading.set(true);

        this.projectTasksService
            .getOneTask(projectId, taskId)
            .pipe(
                finalize(() => {
                    this.isLoading.set(false);
                })
            )
            .subscribe(task => {
                this.task.set(task);
            });
    }

    protected updateTask(task: ProjectTask) {
        this.task.set(task);
    }
}
