import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal
} from '@angular/core';
import {TuiButton, TuiHint} from '@taiga-ui/core';
import {TuiAvatar} from '@taiga-ui/kit';
import {ProjectsService} from '../../../services/projects.service';
import {ProjectListItem} from '../../../interfaces/project.interface';
import {DatePipe} from '@angular/common';
import {ProjectStatusPipe} from '../../../../../shared/pipes/project-status.pipe';
import {finalize} from 'rxjs';
import {TuiSkeleton} from '@taiga-ui/kit';
import {RouterLink} from '@angular/router';

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
