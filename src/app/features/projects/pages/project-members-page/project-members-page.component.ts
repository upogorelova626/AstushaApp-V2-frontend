import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal
} from '@angular/core';
import {ProjectMembersComponent} from '../../components/project-members-page-components/project-members/project-members.component';
import {ProjectMembersStatsComponent} from '../../components/project-members-page-components/project-members-stats/project-members-stats.component';
import {ActivatedRoute} from '@angular/router';
import {ProjectNavigateComponent} from '../../components/project-details-page-components/project-navigate/project-navigate.component';
import {TuiSkeleton} from '@taiga-ui/kit';

@Component({
    selector: 'app-project-members-page',
    imports: [
        ProjectMembersComponent,
        ProjectMembersStatsComponent,
        ProjectNavigateComponent,
        TuiSkeleton
    ],
    templateUrl: './project-members-page.component.html',
    styleUrl: './project-members-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectMembersPageComponent implements OnInit {
    protected readonly projectId = signal<string | null>(null);
    private readonly route = inject(ActivatedRoute);
    protected readonly isProjectLoading = signal(false);

    ngOnInit(): void {
        this.isProjectLoading.set(true);
        const projectId = this.route.snapshot.paramMap.get('projectId');
        if (!projectId) {
            return;
        }
        this.projectId.set(projectId);
        this.isProjectLoading.set(false);
    }
}
