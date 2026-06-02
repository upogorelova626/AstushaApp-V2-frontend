import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {MyTask} from '../../interfaces/my-tasks.interface';
import {TuiSkeleton} from '@taiga-ui/kit';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-my-tasks-list',
    imports: [TuiButton, TuiSkeleton, DatePipe],
    templateUrl: './my-tasks-list.component.html',
    styleUrl: './my-tasks-list.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyTasksListComponent {
    readonly tasks = input<MyTask[]>([]);
    readonly isLoading = input(false);
}
