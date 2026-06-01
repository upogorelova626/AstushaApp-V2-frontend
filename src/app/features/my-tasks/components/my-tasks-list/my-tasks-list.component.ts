import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';

@Component({
    selector: 'app-my-tasks-list',
    imports: [TuiButton],
    templateUrl: './my-tasks-list.component.html',
    styleUrl: './my-tasks-list.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyTasksListComponent {}
