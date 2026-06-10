import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MyTask} from '../../../interfaces/my-tasks.interface';
import {ProjectTask} from '../../../../projects/interfaces/project-tasks.interface';

@Component({
    selector: 'app-task-content-card',
    imports: [],
    templateUrl: './task-content-card.component.html',
    styleUrl: './task-content-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskContentCardComponent {
    readonly task = input<ProjectTask | null>(null);
    readonly isLoading = input(false);
}
