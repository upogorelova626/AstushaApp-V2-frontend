import {AsyncPipe} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal
} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TuiButton, TuiHint, TuiIcon} from '@taiga-ui/core';
import {TuiSkeleton} from '@taiga-ui/kit';
import {UsersService} from '../../../../features/users/services/users.service';
import {ProjectsService} from '../../../../features/projects/services/projects.service';
import {Project} from '../../../../features/projects/interfaces/project.interface';
import {filter, finalize, map} from 'rxjs';

@Component({
    selector: 'app-sidebar',
    imports: [TuiIcon, TuiButton, RouterLink, TuiHint, TuiSkeleton, AsyncPipe],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
    private readonly usersService = inject(UsersService);
    private readonly projectsService = inject(ProjectsService);

    protected readonly profile$ = this.usersService.profile$;

    protected readonly projects = signal<Project[]>([]);
    protected readonly isLoading = signal(false);

    ngOnInit() {
        this.isLoading.set(true);
        this.projectsService
            .getProjects()
            .pipe(
                map(projects => projects.slice(0, 3)),
                finalize(() => this.isLoading.set(false))
            )
            .subscribe(projects => this.projects.set(projects));
    }
}
