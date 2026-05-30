import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal
} from '@angular/core';
import {ActivatedRoute, RouterOutlet} from '@angular/router';
import {ProjectNavigateComponent} from '../../features/projects/components/project-details-page-components/project-navigate/project-navigate.component';
import {ProjectsService} from '../../features/projects/services/projects.service';
import {Project} from '../../features/projects/interfaces/project.interface';
import {TuiSkeleton} from '@taiga-ui/kit';

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

    protected readonly project = signal<Project | null>(null);

    ngOnInit() {
        const projectId = this.route.snapshot.paramMap.get('projectId');

        if (!projectId) {
            return;
        }

        this.loadProject(projectId);
    }

    protected loadProject(projectId: string) {
        this.projectsService.getOneProject(projectId).subscribe(project => {
            this.project.set(project);
        });
    }

    protected readonly updateProject = (project: Project) => {
        this.project.set(project);
    };
}
