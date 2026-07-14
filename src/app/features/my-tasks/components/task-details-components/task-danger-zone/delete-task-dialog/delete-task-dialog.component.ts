import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal
} from '@angular/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import {TuiButton, type TuiDialogContext} from '@taiga-ui/core';
import {ProjectTasksService} from '../../../../../projects/services/project-tasks.service';
import {ProjectTask} from '../../../../../../shared/interfaces/project-tasks.interface';
import {finalize} from 'rxjs';

@Component({
    selector: 'app-delete-task-dialog',
    imports: [TuiButton],
    templateUrl: './delete-task-dialog.component.html',
    styleUrl: './delete-task-dialog.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteTaskDialogComponent {
    protected readonly context =
        injectContext<TuiDialogContext<boolean, ProjectTask>>();
    protected task = this.context.data;

    private readonly projectTaskService = inject(ProjectTasksService);
    protected readonly isDeleting = signal(false);

    deleteTask() {
        const taskId = this.task.id;
        const projectId = this.task.projectId;
        this.isDeleting.set(true);

        this.projectTaskService
            .deleteTask(projectId, taskId)
            .pipe(
                finalize(() => {
                    this.isDeleting.set(false);
                })
            )
            .subscribe(() => {
                this.context.completeWith(true);
            });
    }
}
