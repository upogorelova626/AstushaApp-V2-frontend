import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {TuiIcon} from '@taiga-ui/core';

@Component({
    selector: 'app-project-team-card',
    imports: [TuiButton, TuiIcon],
    templateUrl: './project-team-card.component.html',
    styleUrl: './project-team-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectTeamCardComponent {}
