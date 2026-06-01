import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    OnInit,
    signal
} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute, RouterOutlet} from '@angular/router';
import {TuiSkeleton} from '@taiga-ui/kit';

import {AuthService} from '../../features/auth/services/auth.service';
import {ProjectNavigateComponent} from '../../features/projects/components/project-details-page-components/project-navigate/project-navigate.component';
import {Project} from '../../features/projects/interfaces/project.interface';
import {ProjectsService} from '../../features/projects/services/projects.service';

@Component({
    selector: 'app-project-layout',
    imports: [RouterOutlet, ProjectNavigateComponent, TuiSkeleton],
    templateUrl: './project-layout.component.html',
    styleUrl: './project-layout.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectLayoutComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly projectsService = inject(ProjectsService);
    private readonly authService = inject(AuthService);

    protected readonly project = signal<Project | null>(null);

    private readonly me = toSignal(this.authService.me(), {
        initialValue: null
    });

    protected readonly canManageProject = computed(() => {
        const project = this.project();
        const me = this.me();

        if (!project || !me) {
            return false;
        }

        const currentProjectMember = project.members.find(
            member => member.userId === me.id
        );

        return (
            currentProjectMember?.role === 'OWNER' ||
            currentProjectMember?.role === 'ADMIN'
        );
    });

    ngOnInit() {
        const projectId = this.route.snapshot.paramMap.get('projectId');

        if (!projectId) {
            return;
        }

        this.loadProject(projectId);
    }

    protected readonly updateProject = (project: Project) => {
        this.project.set(project);
    };

    private loadProject(projectId: string) {
        this.projectsService.getOneProject(projectId).subscribe(project => {
            this.project.set(project);
        });
    }
}
