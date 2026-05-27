import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiAvatar} from '@taiga-ui/kit';

@Component({
    selector: 'app-project-members-stats',
    imports: [TuiAvatar],
    templateUrl: './project-members-stats.component.html',
    styleUrl: './project-members-stats.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectMembersStatsComponent {}
