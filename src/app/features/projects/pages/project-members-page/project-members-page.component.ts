import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    Signal
} from '@angular/core';
import {ProjectMembersComponent} from '../../components/project-members-page-components/project-members/project-members.component';
import {ProjectMembersStatsComponent} from '../../components/project-members-page-components/project-members-stats/project-members-stats.component';
import {ROUTER_OUTLET_DATA} from '@angular/router';
import {ProjectOutletData} from '../../../../shared/interfaces/project-outlet-data.interface';
import {Project} from '../../../../shared/interfaces/project.interface';

@Component({
    selector: 'app-project-members-page',
    imports: [ProjectMembersComponent, ProjectMembersStatsComponent],
    templateUrl: './project-members-page.component.html',
    styleUrl: './project-members-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectMembersPageComponent {
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
