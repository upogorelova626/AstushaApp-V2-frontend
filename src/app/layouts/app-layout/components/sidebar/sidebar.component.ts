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
import {TuiSkeleton, TuiAvatar} from '@taiga-ui/kit';
import {UsersService} from '../../../../shared/services/users.service';
import {ProjectsService} from '../../../../shared/services/projects.service';
import {Project} from '../../../../shared/interfaces/project.interface';
import {finalize, map} from 'rxjs';

@Component({
    selector: 'app-sidebar',
    imports: [
        TuiIcon,
        TuiButton,
        RouterLink,
        TuiHint,
        TuiSkeleton,
        TuiAvatar,
        AsyncPipe
    ],
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
                map(projects => projects.slice(0, 4)),
                finalize(() => this.isLoading.set(false))
            )
            .subscribe(projects => this.projects.set(projects));
    }

    protected readonly sidebarButtons = [
        {link: '/dashboard', icon: '@tui.kanban', text: 'Доски'},
        {link: '/dashboard/projects', icon: '@tui.folder', text: 'Проекты'},
        {
            link: '/dashboard/my-tasks',
            icon: '@tui.circle-check',
            text: 'Мои задачи'
        },
        {link: '/dashboard/teams', icon: '@tui.users', text: 'Команды'},
        {link: '/dashboard/profile', icon: '@tui.user', text: 'Профиль'}
    ];
}
