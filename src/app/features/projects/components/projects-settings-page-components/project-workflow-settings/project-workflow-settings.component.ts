import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    signal
} from '@angular/core';
import {TuiButton, TuiIcon} from '@taiga-ui/core';
import {Project} from '../../../../../shared/interfaces/project.interface';
import {ProjectsService} from '../../../../../shared/services/projects.service';
import {ProjectWorkflowPipe} from '../../../../../shared/pipes/project-workflow.pipe';
import {ProjectWorkflowType} from '../../../../../shared/interfaces/project.enums';
import {ProjectWorkflowStageCardComponent} from './project-workflow-stage-card/project-workflow-stage-card.component';
import {TuiSkeleton} from '@taiga-ui/kit';

@Component({
    selector: 'app-project-workflow-settings',
    imports: [
        TuiButton,
        TuiIcon,
        TuiSkeleton,
        ProjectWorkflowPipe,
        ProjectWorkflowStageCardComponent
    ],
    templateUrl: './project-workflow-settings.component.html',
    styleUrl: './project-workflow-settings.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectWorkflowSettingsComponent {
    readonly project = input.required<Project>();

    private readonly projectsService = inject(ProjectsService);

    protected readonly isLoading = signal(false);

    protected readonly workflowType = computed(() => {
        return this.project().workflowType;
    });

    protected readonly canEditWorkflowStages = computed(() => {
        return this.workflowType() === ProjectWorkflowType.CUSTOM;
    });

    protected readonly workflowStages = computed(() => {
        return this.project().workflowStages;
    });
}
