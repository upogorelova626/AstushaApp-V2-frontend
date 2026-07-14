import {DatePipe} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    signal
} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TuiButton, TuiHint, TuiHintDirective} from '@taiga-ui/core';
import {TuiBadge, TuiSkeleton} from '@taiga-ui/kit';
import {MyTask} from '../../../interfaces/my-tasks.interface';
import {TuiTable} from '@taiga-ui/addon-table';

@Component({
    selector: 'app-my-tasks-list',
    imports: [
        TuiButton,
        TuiSkeleton,
        DatePipe,
        TuiHintDirective,
        TuiHint,
        TuiTable,
        TuiBadge,
        RouterLink
    ],
    templateUrl: './my-tasks-list.component.html',
    styleUrl: './my-tasks-list.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyTasksListComponent {
    readonly tasks = input<MyTask[]>([]);
    readonly isLoading = input(false);

    protected readonly pageSize = 5;

    private readonly pageIndex = signal(0);

    protected readonly previewTasks = computed(() =>
        this.tasks().slice(0, this.pageSize)
    );

    protected readonly tasksCount = computed(() => this.tasks().length);

    protected readonly paginatedTasks = computed(() => {
        const start = this.pageIndex() * this.pageSize;

        return this.tasks().slice(start, start + this.pageSize);
    });

    protected readonly totalPages = computed(() => {
        const pages = Math.ceil(this.tasks().length / this.pageSize);

        return Math.max(pages, 1);
    });

    protected readonly currentPage = computed(() => this.pageIndex() + 1);

    protected readonly canGoPrev = computed(() => this.pageIndex() > 0);

    protected readonly canGoNext = computed(
        () => this.pageIndex() < this.totalPages() - 1
    );

    protected goToPrevPage(): void {
        if (!this.canGoPrev()) {
            return;
        }

        this.pageIndex.update(page => page - 1);
    }

    protected goToNextPage(): void {
        if (!this.canGoNext()) {
            return;
        }

        this.pageIndex.update(page => page + 1);
    }
}
