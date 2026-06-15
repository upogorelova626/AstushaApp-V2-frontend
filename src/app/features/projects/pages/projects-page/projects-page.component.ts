import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    OnInit,
    signal
} from '@angular/core';
import {ProjectsStatsComponent} from '../../components/projects-page-components/projects-stats/projects-stats.component';
import {ProjectsSearchingComponent} from '../../components/projects-page-components/projects-searching/projects-searching.component';
import {ProjectsListComponent} from '../../components/projects-page-components/projects-list/projects-list.component';
import {ProjectsService} from '../../services/projects.service';
import {ProjectListItem} from '../../interfaces/project.interface';
import {finalize} from 'rxjs';

@Component({
    selector: 'app-projects-page',
    imports: [
        ProjectsStatsComponent,
        ProjectsSearchingComponent,
        ProjectsListComponent
    ],
    templateUrl: './projects-page.component.html',
    styleUrl: './projects-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsPageComponent implements OnInit {
    private readonly projectsService = inject(ProjectsService);

    protected readonly projects = signal<ProjectListItem[]>([]);
    protected readonly isProjectsLoading = signal(true);
    protected readonly searchQuery = signal('');

    protected searchTasks(query: string): void {
        this.searchQuery.set(query);
    }

    ngOnInit() {
        this.isProjectsLoading.set(true);

        this.projectsService
            .getProjects()
            .pipe(finalize(() => this.isProjectsLoading.set(false)))
            .subscribe(projects => this.projects.set(projects));
    }

    protected readonly filteredProjects = computed(() => {
        const projects = this.projects();
        const searchQuery = this.searchQuery().trim().toLowerCase();

        if (!searchQuery) {
            return projects;
        }

        return projects.filter(projects =>
            projects.title.toLowerCase().includes(searchQuery)
        );
    });
}
