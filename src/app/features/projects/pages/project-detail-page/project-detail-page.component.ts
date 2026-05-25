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

import {ProjectActivityComponent} from '../../components/project-details-page-components/project-activity/project-activity.component';
import {ProjectCardComponent} from '../../components/project-details-page-components/project-card/project-card.component';
import {ProjectLastTasksComponent} from '../../components/project-details-page-components/project-last-tasks/project-last-tasks.component';
import {ProjectQuickActionsComponent} from '../../components/project-details-page-components/project-quick-actions/project-quick-actions.component';
import {ProjectTeamCardComponent} from '../../components/project-details-page-components/project-team-card/project-team-card.component';
import {ProjectListItem} from '../../interfaces/projects.interface';
import {ProjectsService} from '../../services/projects.service';

@Component({
    selector: 'app-project-detail-page',
    imports: [
        TuiSkeleton,
        ProjectCardComponent,
        ProjectTeamCardComponent,
        ProjectQuickActionsComponent,
        ProjectLastTasksComponent,
        ProjectActivityComponent
    ],
    templateUrl: './project-detail-page.component.html',
    styleUrl: './project-detail-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDetailPageComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly projectsService = inject(ProjectsService);

    protected readonly project = signal<ProjectListItem | null>(null);
    protected readonly isProjectLoading = signal(true);

    ngOnInit() {
        const projectId = this.route.snapshot.paramMap.get('projectId');

        if (!projectId) {
            this.isProjectLoading.set(false);

            return;
        }

        this.loadProject(projectId);
    }

    protected loadProject(projectId: string) {
        this.isProjectLoading.set(true);

        this.projectsService
            .getOneProject(projectId)
            .pipe(finalize(() => this.isProjectLoading.set(false)))
            .subscribe(project => {
                this.project.set(project);
            });
    }
}
