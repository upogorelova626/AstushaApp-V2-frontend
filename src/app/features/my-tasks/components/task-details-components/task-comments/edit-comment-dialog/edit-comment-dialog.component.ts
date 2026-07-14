import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {
    TUI_VALIDATION_ERRORS,
    TuiButton,
    type TuiDialogContext,
    TuiError,
    TuiTextfield
} from '@taiga-ui/core';
import {TuiTextarea} from '@taiga-ui/kit';
import {injectContext} from '@taiga-ui/polymorpheus';
import {ProjectTask} from '../../../../../../shared/interfaces/project-tasks.interface';
import {VALIDATION_ERRORS} from '../../../../../../shared/constants/validation-errors';
import {TaskComment} from '../../../../../../shared/interfaces/task-comment.interface';
import {TaskCommentsService} from '../../../../../../shared/services/task-comments.service';

interface EditCommentDialogData {
    commentItem: TaskComment;
    task: ProjectTask;
}

@Component({
    selector: 'app-edit-comment-dialog',
    imports: [
        TuiButton,
        TuiTextfield,
        TuiTextarea,
        TuiError,
        ReactiveFormsModule
    ],
    templateUrl: './edit-comment-dialog.component.html',
    styleUrl: './edit-comment-dialog.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: TUI_VALIDATION_ERRORS,
            useValue: VALIDATION_ERRORS
        }
    ]
})
export class EditCommentDialogComponent {
    private readonly taskCommentsService = inject(TaskCommentsService);

    protected readonly context =
        injectContext<TuiDialogContext<TaskComment, EditCommentDialogData>>();

    protected readonly comment = this.context.data.commentItem;
    protected readonly task = this.context.data.task;

    protected readonly form = new FormControl(this.comment.text, {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(2000)]
    });

    protected editComment() {
        this.form.markAsTouched();

        const text = this.form.value.trim();

        if (this.form.invalid || !text) {
            return;
        }

        const projectId = this.task.projectId;
        const taskId = this.task.id;
        const commentId = this.comment.id;
        const payload = {text};

        this.taskCommentsService
            .editTaskComment(projectId, taskId, commentId, payload)
            .subscribe(updatedComment => {
                this.context.completeWith(updatedComment);
            });
    }
}
