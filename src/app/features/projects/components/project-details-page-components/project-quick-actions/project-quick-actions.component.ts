import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiButton, TuiIcon} from '@taiga-ui/core';

@Component({
    selector: 'app-project-quick-actions',
    imports: [TuiButton, TuiIcon],
    templateUrl: './project-quick-actions.component.html',
    styleUrl: './project-quick-actions.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectQuickActionsComponent {}
