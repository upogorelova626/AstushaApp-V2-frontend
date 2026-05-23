import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    OnInit,
    signal
} from '@angular/core';
import {TuiAvatar} from '@taiga-ui/kit';
import {TuiButton} from '@taiga-ui/core';
import {TeamMembersService} from '../../../services/team-members.service';
import {TeamMember} from '../../../interfaces/team-members.interface';
import {TeamRoleLabelPipe} from '../../../../../shared/pipes/team-role-label.pipe';

@Component({
    selector: 'tbody[app-team-members-list]',
    imports: [TuiAvatar, TuiButton, TeamRoleLabelPipe],
    templateUrl: './team-members-list.component.html',
    styleUrl: './team-members-list.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamMembersListComponent implements OnInit {
    private readonly teamMembersService = inject(TeamMembersService);

    readonly teamId = input.required<string>();

    protected readonly teamMembers = signal<TeamMember[]>([]);

    ngOnInit() {
        this.teamMembersService
            .getTeamMembers(this.teamId())
            .subscribe(teamMembers => {
                this.teamMembers.set(teamMembers);
            });
    }
}
