import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    Signal
} from '@angular/core';
import {ROUTER_OUTLET_DATA} from '@angular/router';
import {ProjectActivityComponent} from '../../components/project-details-page-components/project-activity/project-activity.component';
import {ProjectCardComponent} from '../../components/project-details-page-components/project-card/project-card.component';
import {ProjectRepositoriesComponent} from '../../components/project-details-page-components/project-repositories/project-repositories.component';
import {ProjectQuickActionsComponent} from '../../components/project-details-page-components/project-quick-actions/project-quick-actions.component';
import {ProjectTeamCardComponent} from '../../components/project-details-page-components/project-team-card/project-team-card.component';
import {Project} from '../../interfaces/project.interface';
import {ProjectOutletData} from '../../../../shared/interfaces/project-outlet-data.interface';

@Component({
    selector: 'app-project-detail-page',
    imports: [
        ProjectCardComponent,
        ProjectTeamCardComponent,
        ProjectQuickActionsComponent,
        ProjectActivityComponent,
        ProjectRepositoriesComponent
    ],
    templateUrl: './project-detail-page.component.html',
    styleUrl: './project-detail-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDetailPageComponent {
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
}
