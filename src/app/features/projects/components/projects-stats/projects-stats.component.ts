import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiAvatar} from '@taiga-ui/kit';

@Component({
    selector: 'app-projects-stats',
    imports: [TuiAvatar],
    templateUrl: './projects-stats.component.html',
    styleUrl: './projects-stats.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsStatsComponent {}
