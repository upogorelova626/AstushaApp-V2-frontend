import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiButton, TuiIcon} from '@taiga-ui/core';

@Component({
    selector: 'app-team-roles-settings',
    imports: [TuiButton, TuiIcon],
    templateUrl: './team-roles-settings.component.html',
    styleUrl: './team-roles-settings.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamRolesSettingsComponent {}
