import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TuiButton, TuiIcon} from '@taiga-ui/core';
import {MyTask} from '../../../interfaces/my-tasks.interface';

@Component({
    selector: 'app-task-files-card',
    imports: [TuiButton, TuiIcon],
    templateUrl: './task-files-card.component.html',
    styleUrl: './task-files-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskFilesCardComponent {
    readonly task = input<MyTask | null>(null);
    readonly isLoading = input(false);
}
