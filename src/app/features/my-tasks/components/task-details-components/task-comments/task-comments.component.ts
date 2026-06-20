import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {ProjectTask} from '../../../../projects/interfaces/project-tasks.interface';

@Component({
    selector: 'app-task-comments',
    imports: [],
    templateUrl: './task-comments.component.html',
    styleUrl: './task-comments.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCommentsComponent {
    readonly task = input<ProjectTask | null>(null);
    readonly isLoading = input(false);
}
