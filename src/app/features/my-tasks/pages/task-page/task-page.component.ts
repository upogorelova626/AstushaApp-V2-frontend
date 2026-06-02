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
import {MyTasksService} from '../../services/my-tasks.service';
import {MyTask} from '../../interfaces/my-tasks.interface';
import {finalize} from 'rxjs';

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
    private readonly tasksService = inject(MyTasksService);

    protected readonly task = signal<MyTask | null>(null);
    protected readonly isLoading = signal(false);

    ngOnInit(): void {
        const taskId = this.route.snapshot.paramMap.get('taskId');

        if (!taskId) {
            return;
        }

        this.isLoading.set(true);

        this.tasksService
            .getMyTask(taskId)
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
