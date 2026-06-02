import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal
} from '@angular/core';
import {MyTasksListComponent} from '../../components/my-tasks-page-components/my-task-list/my-tasks-list.component';
import {MyTasksStatsComponent} from '../../components/my-tasks-page-components/my-tasks-stats/my-tasks-stats.component';
import {MyTasksToolbarComponent} from '../../components/my-tasks-page-components/my-tasks-toolbar/my-tasks-toolbar.component';
import {MyTasksService} from '../../services/my-tasks.service';
import {MyTask} from '../../interfaces/my-tasks.interface';
import {finalize} from 'rxjs';

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
export class MyTasksPageComponent implements OnInit {
    private readonly myTasksService = inject(MyTasksService);

    protected readonly tasks = signal<MyTask[]>([]);
    protected readonly isLoading = signal(false);

    ngOnInit() {
        this.isLoading.set(true);
        this.myTasksService
            .getAllMyTasks()
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe(tasks => this.tasks.set(tasks));
    }
}
