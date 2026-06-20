import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {ProjectTask} from '../../../../projects/interfaces/project-tasks.interface';
import {TuiButton, TuiCell, TuiInput, TuiTextfield} from '@taiga-ui/core';
import {TuiAvatar, TuiTextarea} from '@taiga-ui/kit';

@Component({
    selector: 'app-task-comments',
    imports: [TuiInput, TuiTextfield, TuiButton, TuiTextarea],
    templateUrl: './task-comments.component.html',
    styleUrl: './task-comments.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCommentsComponent {
    readonly task = input<ProjectTask | null>(null);
    readonly isLoading = input(false);
}
