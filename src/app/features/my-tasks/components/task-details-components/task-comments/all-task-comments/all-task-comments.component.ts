import {DatePipe} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject,
    Injector,
    signal
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
    TuiButton,
    TuiDialogService,
    type TuiDialogContext,
    TuiNotificationService
} from '@taiga-ui/core';
import {injectContext, PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {switchMap} from 'rxjs';

import {AuthUser} from '../../../../../auth/models/interfaces/auth.interface';
import {ProjectTask} from '../../../../../projects/interfaces/project-tasks.interface';
import {TaskComment} from '../../../../interfaces/task-comment.interface';
import {TaskCommentsService} from '../../../../services/task-comments.service';
import {EditCommentDialogComponent} from '../edit-comment-dialog/edit-comment-dialog.component';

interface AllCommentDialogData {
    comments: TaskComment[];
    currentUser: AuthUser;
    task: ProjectTask;
}

@Component({
    selector: 'app-all-task-comments',
    imports: [TuiButton, DatePipe],
    templateUrl: './all-task-comments.component.html',
    styleUrl: './all-task-comments.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllTaskCommentsComponent {
    private readonly taskCommentsService = inject(TaskCommentsService);
    private readonly dialogs = inject(TuiDialogService);
    private readonly alerts = inject(TuiNotificationService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly injector = inject(Injector);

    protected readonly context =
        injectContext<TuiDialogContext<TaskComment[], AllCommentDialogData>>();

    protected readonly comments = signal(this.context.data.comments);
    protected readonly currentUser = this.context.data.currentUser;
    protected readonly task = this.context.data.task;

    protected openEditCommentDialog(commentItem: TaskComment): void {
        if (!this.canEditComment(commentItem)) {
            return;
        }

        this.dialogs
            .open<TaskComment>(
                new PolymorpheusComponent(
                    EditCommentDialogComponent,
                    this.injector
                ),
                {
                    label: 'Редактировать комментарий',
                    size: 's',
                    data: {
                        commentItem,
                        task: this.task
                    }
                }
            )
            .pipe(
                switchMap(updatedComment => {
                    this.comments.update(comments =>
                        comments.map(comment =>
                            comment.id === updatedComment.id
                                ? updatedComment
                                : comment
                        )
                    );

                    this.syncComments();

                    return this.alerts.open('Комментарий изменен', {
                        label: 'Готово'
                    });
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    protected deleteComment(comment: TaskComment): void {
        const projectId = this.task.projectId;
        const taskId = this.task.id;

        if (!projectId || !taskId || !this.canDeleteComment(comment)) {
            return;
        }

        this.taskCommentsService
            .deleteTaskComment(projectId, taskId, comment.id)
            .pipe(
                switchMap(() => {
                    this.comments.update(comments =>
                        comments.filter(
                            commentItem => commentItem.id !== comment.id
                        )
                    );

                    this.syncComments();

                    return this.alerts.open('Комментарий удален', {
                        label: 'Готово'
                    });
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    protected canDeleteComment(comment: TaskComment): boolean {
        return (
            this.currentUser.id === comment.author.id ||
            this.task.createdBy?.id === this.currentUser.id
        );
    }

    protected canEditComment(comment: TaskComment): boolean {
        return this.currentUser.id === comment.author.id;
    }

    protected getAuthorName(comment: TaskComment): string {
        const fullName =
            `${comment.author.firstName ?? ''} ${comment.author.lastName ?? ''}`.trim();

        return fullName || comment.author.login;
    }

    protected getAuthorInitials(comment: TaskComment): string {
        const firstName = comment.author.firstName?.trim();
        const lastName = comment.author.lastName?.trim();

        if (firstName || lastName) {
            return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
        }

        return comment.author.login.slice(0, 2).toUpperCase();
    }

    private syncComments(): void {
        this.context.$implicit.next(this.comments());
    }
}
