import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiButton, TuiIcon, TuiInput, TuiTextfield} from '@taiga-ui/core';
import {TuiChevron, TuiTextarea} from '@taiga-ui/kit';

@Component({
    selector: 'app-team-invite-member',
    imports: [
        TuiButton,
        TuiChevron,
        TuiIcon,
        TuiInput,
        TuiTextarea,
        TuiTextfield
    ],
    templateUrl: './team-invite-member.component.html',
    styleUrl: './team-invite-member.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamInviteMemberComponent {}
