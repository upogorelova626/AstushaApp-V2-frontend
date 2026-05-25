import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    signal
} from '@angular/core';
import {TuiAvatar, TuiSkeleton} from '@taiga-ui/kit';
import {finalize} from 'rxjs';

import {
    ProjectStatus,
    ProjectListItem
} from '../../../interfaces/projects.interface';
import {ProjectsService} from '../../../services/projects.service';

@Component({
    selector: 'app-projects-stats',
    imports: [TuiAvatar, TuiSkeleton],
    templateUrl: './projects-stats.component.html',
    styleUrl: './projects-stats.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsStatsComponent {
    private readonly projectsService = inject(ProjectsService);

    protected readonly projects = signal<ProjectListItem[]>([]);
    protected readonly isProjectsLoading = signal(true);

    ngOnInit() {
        this.loadProjects();
    }

    protected loadProjects() {
        this.isProjectsLoading.set(true);

        this.projectsService
            .getProjects()
            .pipe(finalize(() => this.isProjectsLoading.set(false)))
            .subscribe(projects => this.projects.set(projects));
    }

    protected readonly totalProjectsCount = computed(
        () => this.projects().length
    );

    protected readonly projectsCreatedLastMonthCount = computed(() => {
        const currentDate = new Date();
        const monthAgoLimit = new Date();

        monthAgoLimit.setDate(currentDate.getDate() - 30);

        return this.projects().filter(project => {
            const createdAt = new Date(project.createdAt);

            return createdAt >= monthAgoLimit && createdAt <= currentDate;
        }).length;
    });

    protected readonly activeProjects = computed(
        () =>
            this.projects().filter(
                project => project.status === ProjectStatus.ACTIVE
            ).length
    );

    protected readonly activeProjectsPercent = computed(() => {
        const totalProjects = this.totalProjectsCount();

        if (!totalProjects) {
            return 0;
        }

        return Math.ceil((this.activeProjects() / totalProjects) * 100);
    });

    protected readonly completedProjectsCount = computed(
        () =>
            this.projects().filter(
                project => project.status === ProjectStatus.COMPLETED
            ).length
    );

    protected readonly projectsCompletedLastMonthCount = computed(() => {
        const currentDate = new Date();
        const monthAgoLimit = new Date();

        monthAgoLimit.setDate(currentDate.getDate() - 30);

        return this.projects().filter(project => {
            if (
                project.status !== ProjectStatus.COMPLETED ||
                !project.completedAt
            ) {
                return false;
            }

            const completedAt = new Date(project.completedAt);

            return completedAt >= monthAgoLimit && completedAt <= currentDate;
        }).length;
    });

    protected readonly projectsWithUpcomingDeadlineCount = computed(() => {
        const currentDate = new Date();
        const deadlineLimit = new Date();

        deadlineLimit.setDate(currentDate.getDate() + 14);

        return this.projects().filter(project => {
            if (!project.deadline) {
                return false;
            }

            if (
                project.status === ProjectStatus.COMPLETED ||
                project.status === ProjectStatus.ARCHIVED
            ) {
                return false;
            }

            const deadline = new Date(project.deadline);

            return deadline >= currentDate && deadline <= deadlineLimit;
        }).length;
    });
}
