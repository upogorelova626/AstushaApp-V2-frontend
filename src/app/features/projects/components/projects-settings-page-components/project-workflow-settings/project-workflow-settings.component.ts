import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiButton, TuiIcon} from '@taiga-ui/core';
import {TuiChevron} from '@taiga-ui/kit';

@Component({
    selector: 'app-project-workflow-settings',
    imports: [TuiButton, TuiChevron, TuiIcon],
    templateUrl: './project-workflow-settings.component.html',
    styleUrl: './project-workflow-settings.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectWorkflowSettingsComponent {}
