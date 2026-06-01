import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiAvatar} from '@taiga-ui/kit';

@Component({
    selector: 'app-my-tasks-stats',
    imports: [TuiAvatar],
    templateUrl: './my-tasks-stats.component.html',
    styleUrl: './my-tasks-stats.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyTasksStatsComponent {}
