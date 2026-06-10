import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal
} from '@angular/core';
import {TaskMainCardComponent} from '../../components/task-details-components/task-main-card/task-main-card.component';
import {TaskContentCardComponent} from '../../components/task-details-components/task-content-card/task-content-card.component';
import {TaskFilesCardComponent} from '../../components/task-details-components/task-files-card/task-files-card.component';
import {TaskHistoryCardComponent} from '../../components/task-details-components/task-history-card/task-history-card.component';
import {ActivatedRoute} from '@angular/router';
import {finalize} from 'rxjs';
import {ProjectTasksService} from '../../../projects/services/project-tasks.service';
import {ProjectTask} from '../../../projects/interfaces/project-tasks.interface';

@Component({
    selector: 'app-task-page',
    imports: [
        TaskMainCardComponent,
        TaskContentCardComponent,
        TaskFilesCardComponent,
        TaskHistoryCardComponent
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
}
