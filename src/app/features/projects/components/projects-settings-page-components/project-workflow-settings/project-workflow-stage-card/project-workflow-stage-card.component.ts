import {ChangeDetectionStrategy, Component, input} from '@angular/core';

import {ProjectWorkflowStage} from '../../../../interfaces/project.interface';

@Component({
    selector: 'app-project-workflow-stage-card',
    imports: [],
    templateUrl: './project-workflow-stage-card.component.html',
    styleUrl: './project-workflow-stage-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectWorkflowStageCardComponent {
    readonly workflowStage = input.required<ProjectWorkflowStage>();
}
