import {ChangeDetectionStrategy, Component} from '@angular/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import {TuiButton, type TuiDialogContext, TuiInput} from '@taiga-ui/core';
import {TaskComment} from '../../../../interfaces/task-comment.interface';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-all-task-comments',
    imports: [TuiInput, DatePipe],
    templateUrl: './all-task-comments.component.html',
    styleUrl: './all-task-comments.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllTaskCommentsComponent {
    protected readonly context =
        injectContext<TuiDialogContext<string, TaskComment[]>>();
    protected comments = this.context.data;

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
}
