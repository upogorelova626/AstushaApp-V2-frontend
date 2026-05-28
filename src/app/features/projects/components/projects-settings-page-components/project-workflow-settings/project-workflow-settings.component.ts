import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    OnInit,
    signal
} from '@angular/core';
import {TuiButton, TuiIcon} from '@taiga-ui/core';
import {ProjectListItem} from '../../../interfaces/project.interface';
import {ProjectsService} from '../../../services/projects.service';
import {ProjectWorkflowPipe} from '../../../../../shared/pipes/project-workflow.pipe';
import {ProjectWorkflowType} from '../../../interfaces/project.enums';

@Component({
    selector: 'app-project-workflow-settings',
    imports: [TuiButton, TuiIcon, ProjectWorkflowPipe],
    templateUrl: './project-workflow-settings.component.html',
    styleUrl: './project-workflow-settings.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectWorkflowSettingsComponent {
    readonly project = input.required<ProjectListItem>();

    private readonly projectsService = inject(ProjectsService);

    protected readonly isLoading = signal(false);

    protected readonly workflowType = computed(() => {
        return this.project().workflowType;
    });

    protected readonly canEditWorkflowStages = computed(() => {
        return this.workflowType() === ProjectWorkflowType.CUSTOM;
    });
}
