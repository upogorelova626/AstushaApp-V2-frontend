import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiIcon} from '@taiga-ui/core';

@Component({
    selector: 'app-project-workflow-stage-card',
    imports: [TuiIcon],
    templateUrl: './project-workflow-stage-card.component.html',
    styleUrl: './project-workflow-stage-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectWorkflowStageCardComponent {}
