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
    TuiButton,
    TuiInput,
    TuiTextfield,
    TuiError,
    TuiDialogService,
    TuiNotificationService
} from '@taiga-ui/core';
import {TuiTextarea} from '@taiga-ui/kit';
import {catchError, EMPTY, finalize, switchMap} from 'rxjs';
import {ProjectTask} from '../../../../projects/interfaces/project-tasks.interface';
import {TaskComment} from '../../../interfaces/task-comment.interface';
import {TaskCommentsService} from '../../../services/task-comments.service';
import {DatePipe} from '@angular/common';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {AllTaskCommentsComponent} from './all-task-comments/all-task-comments.component';

@Component({
    selector: 'app-task-comments',
    imports: [
        TuiInput,
        TuiTextfield,
        TuiButton,
        TuiTextarea,
        ReactiveFormsModule,
        DatePipe,
        TuiError
    ],
    templateUrl: './task-comments.component.html',
    styleUrl: './task-comments.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCommentsComponent {
    private readonly taskCommentsService = inject(TaskCommentsService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly dialogs = inject(TuiDialogService);
    private readonly alerts = inject(TuiNotificationService);
    private readonly injector = inject(Injector);

    readonly task = input<ProjectTask | null>(null);
    readonly isTaskLoading = input(false);

    protected readonly isCommentAdding = signal(false);
    protected readonly isCommentsLoading = signal(false);
    protected readonly comments = signal<TaskComment[]>([]);

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

    protected showAllComments() {
        const comments = this.comments();
        if (!comments) {
            return;
        }
        this.dialogs
            .open<string>(
                new PolymorpheusComponent(
                    AllTaskCommentsComponent,
                    this.injector
                ),
                {
                    label: 'Все комментарии',
                    size: 'l',
                    data: comments
                }
            )
            .pipe(switchMap(name => this.alerts.open(name)))
            .subscribe();
    }
}
