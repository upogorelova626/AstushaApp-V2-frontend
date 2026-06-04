import {
    ChangeDetectionStrategy,
    Component,
    effect,
    inject,
    input,
    signal
} from '@angular/core';
import {Router} from '@angular/router';
import {
    TuiButton,
    TuiDialog,
    TuiHint,
    TuiHintDirective,
    TuiIcon,
    TuiInput,
    TuiTextfield
} from '@taiga-ui/core';
import {TuiAvatar, TuiSkeleton} from '@taiga-ui/kit';
import {finalize, forkJoin} from 'rxjs';
import {TeamRoleLabelPipe} from '../../../../../shared/pipes/team-role-label.pipe';
import {Team} from '../../../interfaces/team.interface';
import {TeamMember} from '../../../interfaces/team-members.interface';
import {TeamMembersService} from '../../../services/team-members.service';
import {TeamsService} from '../../../services/teams.service';

@Component({
    selector: 'app-team-detail',
    imports: [
        TuiTextfield,
        TuiInput,
        TuiButton,
        TuiHintDirective,
        TuiHint,
        TuiDialog,
        TuiIcon,
        TuiAvatar,
        TuiSkeleton,
        TeamRoleLabelPipe
    ],
    templateUrl: './team-detail.component.html',
    styleUrl: './team-detail.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamDetailComponent {
    private readonly teamsService = inject(TeamsService);
    private readonly teamMembersService = inject(TeamMembersService);
    private readonly router = inject(Router);

    readonly teamId = input<string | null>(null);

    protected readonly team = signal<Team | null>(null);
    protected readonly teamMembers = signal<TeamMember[]>([]);
    protected readonly isLoading = signal(false);
    protected readonly isNoAccessDialogOpen = signal(false);

    constructor() {
        effect(() => {
            const teamId = this.teamId();

            if (!teamId) {
                this.team.set(null);
                this.teamMembers.set([]);
                this.isLoading.set(false);

                return;
            }

            this.loadTeamData(teamId);
        });
    }

    protected openTeamSettings(team: Team) {
        if (team.myRole === 'OWNER' || team.myRole === 'ADMIN') {
            void this.router.navigate([
                '/dashboard',
                'teams',
                team.id,
                'settings'
            ]);

            return;
        }

        this.isNoAccessDialogOpen.set(true);
    }

    private loadTeamData(teamId: string) {
        this.isLoading.set(true);
        this.team.set(null);
        this.teamMembers.set([]);

        forkJoin({
            team: this.teamsService.getOneTeam(teamId),
            members: this.teamMembersService.getTeamMembers(teamId)
        })
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe(({team, members}) => {
                this.team.set(team);
                this.teamMembers.set(members);
            });
    }
}
