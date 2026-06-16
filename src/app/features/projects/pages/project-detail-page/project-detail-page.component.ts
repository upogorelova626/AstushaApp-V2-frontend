import {
    ChangeDetectionStrategy,
    Component,
    Signal,
    computed,
    effect,
    inject,
    signal
} from '@angular/core';
import {ROUTER_OUTLET_DATA} from '@angular/router';
import {catchError, EMPTY, finalize} from 'rxjs';

import {ProjectOutletData} from '../../../../shared/interfaces/project-outlet-data.interface';
import {ProjectActivityComponent} from '../../components/project-details-page-components/project-activity/project-activity.component';
import {ProjectCardComponent} from '../../components/project-details-page-components/project-card/project-card.component';
import {ProjectQuickActionsComponent} from '../../components/project-details-page-components/project-quick-actions/project-quick-actions.component';
import {ProjectRepositoriesComponent} from '../../components/project-details-page-components/project-repositories/project-repositories.component';
import {ProjectTeamCardComponent} from '../../components/project-details-page-components/project-team-card/project-team-card.component';
import {Project} from '../../interfaces/project.interface';
import {ProjectsService} from '../../services/projects.service';
import {Team} from '../../../teams/interfaces/team.interface';

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
    private readonly projectsService = inject(ProjectsService);

    private readonly outletData = inject(
        ROUTER_OUTLET_DATA
    ) as Signal<ProjectOutletData | null>;

    readonly team = signal<Team | null>(null);
    protected readonly isTeamLoading = signal(false);

    protected readonly project = computed(
        () => this.outletData()?.project ?? null
    );

    protected readonly projectId = computed(
        () => this.outletData()?.projectId ?? null
    );

    protected readonly canManageProject = computed(
        () => this.outletData()?.canManageProject ?? false
    );

    private readonly loadTeamEffect = effect(onCleanup => {
        const projectId = this.projectId();

        this.team.set(null);

        if (!projectId) {
            return;
        }

        this.isTeamLoading.set(true);

        const subscription = this.projectsService
            .getProjectTeam(projectId)
            .pipe(
                catchError(() => {
                    this.team.set(null);

                    return EMPTY;
                }),
                finalize(() => {
                    this.isTeamLoading.set(false);
                })
            )
            .subscribe(team => {
                this.team.set(team);
            });

        onCleanup(() => {
            subscription.unsubscribe();
        });
    });

    protected changeTeam(team: Team | null): void {
        this.team.set(team);
    }

    protected updateProject(project: Project): void {
        this.outletData()?.updateProject(project);
    }
}
