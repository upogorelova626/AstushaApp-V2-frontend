import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    OnInit,
    signal
} from '@angular/core';
import {TuiButton, TuiHint} from '@taiga-ui/core';
import {TuiAvatar} from '@taiga-ui/kit';
import {Project, ProjectListItem} from '../../../interfaces/project.interface';
import {DatePipe} from '@angular/common';
import {ProjectStatusPipe} from '../../../../../shared/pipes/project-status.pipe';
import {TuiSkeleton} from '@taiga-ui/kit';
import {RouterLink} from '@angular/router';
import {ProjectTasksService} from '../../../services/project-tasks.service';

@Component({
    selector: 'app-projects-list',
    imports: [
        TuiButton,
        TuiAvatar,
        TuiSkeleton,
        TuiHint,
        RouterLink,
        DatePipe,
        ProjectStatusPipe
    ],
    templateUrl: './projects-list.component.html',
    styleUrl: './projects-list.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsListComponent {
    readonly projects = input<Project[]>([]);
    readonly isProjectsLoading = input(false);

    protected readonly pageSize = 4;
    private readonly pageIndex = signal(0);

    protected readonly paginatedProjects = computed(() => {
        const start = this.pageIndex() * this.pageSize;

        return this.projects().slice(start, start + this.pageSize);
    });

    protected readonly totalPages = computed(() => {
        const pages = Math.ceil(this.projects().length / this.pageSize);

        return Math.max(pages, 1);
    });

    protected readonly currentPage = computed(() => this.pageIndex() + 1);

    protected readonly canGoPrev = computed(() => this.pageIndex() > 0);

    protected readonly canGoNext = computed(() => {
        return this.pageIndex() < this.totalPages() - 1;
    });

    protected goToPrevPage() {
        if (!this.canGoPrev()) {
            return;
        }

        this.pageIndex.update(page => page - 1);
    }

    protected goToNextPage() {
        if (!this.canGoNext()) {
            return;
        }

        this.pageIndex.update(page => page + 1);
    }
}
