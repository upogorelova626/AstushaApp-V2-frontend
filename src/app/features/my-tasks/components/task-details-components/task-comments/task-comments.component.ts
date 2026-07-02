import {DatePipe} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    inject,
    Injector,
    input,
    signal
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {
    TUI_VALIDATION_ERRORS,
    TuiButton,
    TuiDialogService,
    TuiError,
    TuiNotificationService,
    TuiTextfield
} from '@taiga-ui/core';
import {TuiSkeleton, TuiTextarea} from '@taiga-ui/kit';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {catchError, EMPTY, finalize, switchMap} from 'rxjs';
import {AuthUser} from '../../../../auth/models/interfaces/auth.interface';
import {ProjectTask} from '../../../../projects/interfaces/project-tasks.interface';
import {TaskComment} from '../../../interfaces/task-comment.interface';
import {TaskCommentsService} from '../../../services/task-comments.service';
import {AllTaskCommentsComponent} from './all-task-comments/all-task-comments.component';
import {EditCommentDialogComponent} from './edit-comment-dialog/edit-comment-dialog.component';
import {VALIDATION_ERRORS} from '../../../../../shared/constants/validation-errors';
import {AstushaIdAuthService} from '../../../../auth/services/astusha-id-auth.service';

@Component({
    selector: 'app-task-comments',
    imports: [
        TuiTextfield,
        TuiButton,
        TuiTextarea,
        ReactiveFormsModule,
        DatePipe,
        TuiError,
        TuiSkeleton
    ],
    templateUrl: './task-comments.component.html',
    styleUrl: './task-comments.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: TUI_VALIDATION_ERRORS,
            useValue: VALIDATION_ERRORS
        }
    ]
})
export class TaskCommentsComponent {
    private readonly taskCommentsService = inject(TaskCommentsService);
    private readonly astushaIdAuthService = inject(AstushaIdAuthService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly dialogs = inject(TuiDialogService);
    private readonly alerts = inject(TuiNotificationService);
    private readonly injector = inject(Injector);

    readonly task = input<ProjectTask | null>(null);
    readonly isTaskLoading = input(false);

    protected readonly isCommentAdding = signal(false);
    protected readonly isCommentsLoading = signal(false);
    protected readonly comments = signal<TaskComment[]>([]);
    protected readonly currentUser = signal<AuthUser | null>(null);

    protected readonly comment = new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(2000)]
    });

    protected readonly previewComments = computed(() =>
        [...this.comments()].reverse().slice(0, 3)
    );

    private readonly loadCommentsEffect = effect(() => {
        const task = this.task();

        if (!task) {
            this.comments.set([]);

            return;
        }

        this.loadComments(task.projectId, task.id);
    });

    constructor() {
        this.astushaIdAuthService
            .getMe()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(user => {
                this.currentUser.set(user);
            });
    }

    protected addComment() {
        const task = this.task();

        if (!task) {
            return;
        }

        this.comment.markAllAsTouched();

        const text = this.comment.value.trim();

        if (this.comment.invalid || !text) {
            return;
        }

        this.isCommentAdding.set(true);

        this.taskCommentsService
            .addTaskComment(task.projectId, task.id, {text})
            .pipe(
                catchError(() => EMPTY),
                finalize(() => {
                    this.isCommentAdding.set(false);
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(comment => {
                this.comments.update(comments => [...comments, comment]);
                this.comment.reset();
            });
    }

    protected showAllComments() {
        const comments = this.comments();
        const currentUser = this.currentUser();
        const task = this.task();

        if (!currentUser || !task) {
            return;
        }
        this.dialogs
            .open<void>(
                new PolymorpheusComponent(
                    AllTaskCommentsComponent,
                    this.injector
                ),
                {
                    label: 'Все комментарии',
                    size: 'l',
                    data: {comments, currentUser, task}
                }
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }

    protected deleteComment(comment: TaskComment) {
        const projectId = this.task()?.projectId;
        const taskId = this.task()?.id;

        if (!projectId || !taskId || !this.canDeleteComment(comment)) {
            return;
        }

        this.taskCommentsService
            .deleteTaskComment(projectId, taskId, comment.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.comments.update(comments =>
                    comments.filter(
                        commentItem => commentItem.id !== comment.id
                    )
                );
            });
    }

    protected openEditCommentDialog(commentItem: TaskComment) {
        const task = this.task();

        if (!task) {
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
                        task
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

                    return this.alerts.open('Комментарий изменен', {
                        label: 'Готово'
                    });
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    protected canDeleteComment(comment: TaskComment): boolean {
        const currentUser = this.currentUser();
        const task = this.task();

        if (!currentUser || !task) {
            return false;
        }

        return (
            currentUser.id === comment.author.id ||
            task.createdBy?.id === currentUser.id
        );
    }

    protected canEditComment(comment: TaskComment): boolean {
        const currentUser = this.currentUser();

        if (!currentUser) {
            return false;
        }

        return currentUser.id === comment.author.id;
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

    private loadComments(projectId: string, taskId: string) {
        this.isCommentsLoading.set(true);

        this.taskCommentsService
            .getTaskComments(projectId, taskId)
            .pipe(
                catchError(() => EMPTY),
                finalize(() => {
                    this.isCommentsLoading.set(false);
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(comments => {
                this.comments.set(comments);
            });
    }
}
