import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TuiSkeleton} from '@taiga-ui/kit';
import {finalize} from 'rxjs';

import {ProjectNavigateComponent} from '../../components/project-details-page-components/project-navigate/project-navigate.component';
import {ProjectDangerZoneComponent} from '../../components/projects-settings-page-components/project-danger-zone/project-danger-zone.component';
import {ProjectMainSettingsComponent} from '../../components/projects-settings-page-components/project-main-settings/project-main-settings.component';
import {ProjectTeamSettingsComponent} from '../../components/projects-settings-page-components/project-team-settings/project-team-settings.component';
import {ProjectWorkflowSettingsComponent} from '../../components/projects-settings-page-components/project-workflow-settings/project-workflow-settings.component';
import {Project} from '../../interfaces/project.interface';
import {ProjectsService} from '../../services/projects.service';

@Component({
    selector: 'app-project-settings-page',
    imports: [
        ProjectMainSettingsComponent,
        ProjectTeamSettingsComponent,
        ProjectWorkflowSettingsComponent,
        ProjectDangerZoneComponent,
        ProjectNavigateComponent,
        TuiSkeleton
    ],
    templateUrl: './project-settings-page.component.html',
    styleUrl: './project-settings-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectSettingsPageComponent implements OnInit {
    protected readonly projectId = signal<string | null>(null);
    protected readonly project = signal<Project | null>(null);
    protected readonly isProjectLoading = signal(false);

    private readonly route = inject(ActivatedRoute);
    private readonly projectsService = inject(ProjectsService);

    ngOnInit() {
        const projectId = this.route.snapshot.paramMap.get('projectId');

        if (!projectId) {
            return;
        }

        this.projectId.set(projectId);
        this.isProjectLoading.set(true);

        this.projectsService
            .getOneProject(projectId)
            .pipe(
                finalize(() => {
                    this.isProjectLoading.set(false);
                })
            )
            .subscribe(project => {
                this.project.set(project);
            });
    }

    protected updateProject(project: Project) {
        this.project.set(project);
    }
}
