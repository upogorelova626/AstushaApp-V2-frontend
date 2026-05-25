import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal
} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {TuiAvatar} from '@taiga-ui/kit';
import {ProjectsService} from '../../services/projects.service';
import {ProjectListItem} from '../../interfaces/projects.interface';
import {DatePipe} from '@angular/common';
import {ProjectStatusPipe} from '../../../../shared/pipes/project-status.pipe';
import {finalize} from 'rxjs';
import {TuiSkeleton} from '@taiga-ui/kit';

@Component({
    selector: 'app-projects-list',
    imports: [TuiButton, TuiAvatar, DatePipe, ProjectStatusPipe, TuiSkeleton],
    templateUrl: './projects-list.component.html',
    styleUrl: './projects-list.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsListComponent implements OnInit {
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
}
