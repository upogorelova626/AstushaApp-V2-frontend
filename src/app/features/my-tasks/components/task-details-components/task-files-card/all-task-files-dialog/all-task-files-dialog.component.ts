import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal
} from '@angular/core';
import {TuiDialogContext, TuiIcon, TuiButton} from '@taiga-ui/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import {TaskAttachment} from '../../../../../../shared/interfaces/project-tasks.interface';
import {DecimalPipe} from '@angular/common';
import {TaskAttachmentsService} from '../../../../../../shared/services/task-attachments.service';
import {MyTask} from '../../../../interfaces/my-tasks.interface';

interface AllTaskFilesDialogData {
    attachments: TaskAttachment[];
    task: MyTask | null;
}

@Component({
    selector: 'app-all-task-files-dialog',
    imports: [TuiIcon, DecimalPipe, TuiButton],
    templateUrl: './all-task-files-dialog.component.html',
    styleUrl: './all-task-files-dialog.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllTaskFilesDialogComponent {
    protected readonly context =
        injectContext<
            TuiDialogContext<TaskAttachment[], AllTaskFilesDialogData>
        >();

    private readonly taskAttachmentsService = inject(TaskAttachmentsService);

    protected readonly taskAttachments = signal<TaskAttachment[]>(
        this.context.data.attachments
    );
    protected readonly task = this.context.data.task;

    protected deleteTaskAttachment(attachmentId: string) {
        const projectId = this.task?.projectId;
        const taskId = this.task?.id;

        if (!taskId || !projectId) {
            return;
        }

        this.taskAttachmentsService
            .deleteAttachment(projectId, taskId, attachmentId)
            .subscribe(() => {
                this.taskAttachments.update(attachments =>
                    attachments.filter(
                        attachment => attachment.id !== attachmentId
                    )
                );

                this.context.completeWith(this.taskAttachments());
            });
    }
}
