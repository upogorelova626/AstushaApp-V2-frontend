import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiButton, TuiIcon, TuiInput, TuiTextfield} from '@taiga-ui/core';
import {TuiAvatar, TuiChevron} from '@taiga-ui/kit';

@Component({
    selector: 'app-team-members-settings',
    imports: [TuiAvatar, TuiButton, TuiChevron, TuiInput, TuiTextfield],
    templateUrl: './team-members-settings.component.html',
    styleUrl: './team-members-settings.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamMembersSettingsComponent {}
