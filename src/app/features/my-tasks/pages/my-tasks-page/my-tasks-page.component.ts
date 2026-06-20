import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    computed,
    inject,
    signal
} from '@angular/core';
import {catchError, EMPTY, finalize} from 'rxjs';
import {MyTasksListComponent} from '../../components/my-tasks-page-components/my-task-list/my-tasks-list.component';
import {MyTasksStatsComponent} from '../../components/my-tasks-page-components/my-tasks-stats/my-tasks-stats.component';
import {MyTasksToolbarComponent} from '../../components/my-tasks-page-components/my-tasks-toolbar/my-tasks-toolbar.component';
import {MyTask} from '../../interfaces/my-tasks.interface';
import {MyTasksService} from '../../services/my-tasks.service';

@Component({
    selector: 'app-my-tasks-page',
    imports: [
        MyTasksToolbarComponent,
        MyTasksStatsComponent,
        MyTasksListComponent
    ],
    templateUrl: './my-tasks-page.component.html',
    styleUrl: './my-tasks-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyTasksPageComponent implements OnInit {
    private readonly myTasksService = inject(MyTasksService);

    protected readonly tasks = signal<MyTask[]>([]);
    protected readonly isLoading = signal(false);
    protected readonly searchQuery = signal('');

    protected readonly filteredTasks = computed(() => {
        const searchQuery = this.searchQuery().trim().toLowerCase();

        if (!searchQuery) {
            return this.tasks();
        }

        return this.tasks().filter(task => {
            return task.title.toLowerCase().includes(searchQuery);
        });
    });

    ngOnInit() {
        this.isLoading.set(true);

        this.myTasksService
            .getAllMyTasks()
            .pipe(
                catchError(() => EMPTY),
                finalize(() => {
                    this.isLoading.set(false);
                })
            )
            .subscribe(tasks => {
                this.tasks.set(tasks);
            });
    }

    protected searchTasks(searchQuery: string) {
        this.searchQuery.set(searchQuery);
    }
}
