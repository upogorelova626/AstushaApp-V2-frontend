import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {MyTask} from '../../../interfaces/my-tasks.interface';

@Component({
    selector: 'app-task-history-card',
    imports: [TuiButton],
    templateUrl: './task-history-card.component.html',
    styleUrl: './task-history-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskHistoryCardComponent {
    readonly task = input<MyTask | null>(null);
    readonly isLoading = input(false);
}
