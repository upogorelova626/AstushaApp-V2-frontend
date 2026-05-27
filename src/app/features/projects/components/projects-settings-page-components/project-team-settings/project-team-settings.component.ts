import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiButton, TuiIcon} from '@taiga-ui/core';

@Component({
    selector: 'app-project-team-settings',
    imports: [TuiButton, TuiIcon],
    templateUrl: './project-team-settings.component.html',
    styleUrl: './project-team-settings.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectTeamSettingsComponent {}
