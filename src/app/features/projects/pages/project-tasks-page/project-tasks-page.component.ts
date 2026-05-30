import {
    Component,
    ChangeDetectionStrategy,
    inject,
    computed,
    Signal
} from '@angular/core';
import {ProjectTaskCreateComponent} from '../../components/project-tasks-page-components/project-task-create/project-task-create.component';
import {ROUTER_OUTLET_DATA} from '@angular/router';
import {Project} from '../../interfaces/project.interface';
import {ProjectOutletData} from '../../../../shared/interfaces/project-outlet-data.interface';

@Component({
    selector: 'app-project-tasks-page',
    imports: [ProjectTaskCreateComponent],
    templateUrl: './project-tasks-page.component.html',
    styleUrl: './project-tasks-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectTasksPageComponent {
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
