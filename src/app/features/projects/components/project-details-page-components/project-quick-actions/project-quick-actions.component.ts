import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TuiButton, TuiIcon} from '@taiga-ui/core';
import {RouterLink} from '@angular/router';
import {ProjectListItem} from '../../../interfaces/project.interface';

@Component({
    selector: 'app-project-quick-actions',
    imports: [TuiButton, TuiIcon, RouterLink],
    templateUrl: './project-quick-actions.component.html',
    styleUrl: './project-quick-actions.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectQuickActionsComponent {
    readonly project = input<ProjectListItem | null>(null);
}
