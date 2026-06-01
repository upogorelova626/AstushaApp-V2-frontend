import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MyTasksListComponent} from '../../components/my-tasks-list/my-tasks-list.component';
import {MyTasksStatsComponent} from '../../components/my-tasks-stats/my-tasks-stats.component';
import {MyTasksToolbarComponent} from '../../components/my-tasks-toolbar/my-tasks-toolbar.component';

@Component({
    selector: 'app-my-tasks-page',
    imports: [
        MyTasksListComponent,
        MyTasksStatsComponent,
        MyTasksToolbarComponent
    ],
    templateUrl: './my-tasks-page.component.html',
    styleUrl: './my-tasks-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyTasksPageComponent {}
