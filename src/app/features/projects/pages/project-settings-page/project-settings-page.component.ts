import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    Signal
} from '@angular/core';
import {ROUTER_OUTLET_DATA} from '@angular/router';
import {ProjectDangerZoneComponent} from '../../components/projects-settings-page-components/project-danger-zone/project-danger-zone.component';
import {ProjectMainSettingsComponent} from '../../components/projects-settings-page-components/project-main-settings/project-main-settings.component';
import {ProjectTeamSettingsComponent} from '../../components/projects-settings-page-components/project-team-settings/project-team-settings.component';
import {ProjectWorkflowSettingsComponent} from '../../components/projects-settings-page-components/project-workflow-settings/project-workflow-settings.component';
import {Project} from '../../interfaces/project.interface';
import {ProjectOutletData} from '../../../../shared/interfaces/project-outlet-data.interface';
import {ProjectRepositoriesComponent} from '../../components/project-details-page-components/project-repositories/project-repositories.component';
import {ProjectSprintsSettingsComponent} from '../../components/projects-settings-page-components/project-sprints-settings/project-sprints-settings.component';

@Component({
    selector: 'app-project-settings-page',
    imports: [
        ProjectMainSettingsComponent,
        ProjectTeamSettingsComponent,
        ProjectWorkflowSettingsComponent,
        ProjectDangerZoneComponent,
        ProjectRepositoriesComponent,
        ProjectSprintsSettingsComponent
    ],
    templateUrl: './project-settings-page.component.html',
    styleUrl: './project-settings-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectSettingsPageComponent {
    private readonly outletData = inject(
        ROUTER_OUTLET_DATA
    ) as Signal<ProjectOutletData | null>;

    protected readonly project = computed(
        () => this.outletData()?.project ?? null
    );
    protected readonly projectId = computed(
        () => this.outletData()?.projectId ?? null
    );

    protected updateProject(project: Project) {
        this.outletData()?.updateProject(project);
    }

    protected readonly canManageProject = computed(
        () => this.outletData()?.canManageProject ?? false
    );
}
