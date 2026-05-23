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
import {TuiSkeleton} from '@taiga-ui/kit';
import {PluralizeRuPipe} from '../../../../shared/pipes/pluralize-ru.pipe';
import {Team} from '../../interfaces/team.interface';
import {TeamsService} from '../../services/teams.service';
import {TeamMembersListComponent} from './team-members-list/team-members-list.component';

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
        PluralizeRuPipe,
        TuiSkeleton,
        TeamMembersListComponent
    ],
    templateUrl: './team-detail.component.html',
    styleUrl: './team-detail.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamDetailComponent {
    private readonly teamsService = inject(TeamsService);
    private readonly router = inject(Router);

    readonly teamId = input<string | null>(null);

    protected readonly team = signal<Team | null>(null);
    protected readonly isLoading = signal(false);
    protected readonly isError = signal(false);
    protected readonly isNoAccessDialogOpen = signal(false);

    constructor() {
        effect(() => {
            const teamId = this.teamId();

            if (!teamId) {
                this.team.set(null);
                this.isError.set(false);
                this.isLoading.set(false);

                return;
            }

            this.loadTeam(teamId);
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

    private loadTeam(teamId: string) {
        this.isLoading.set(true);
        this.isError.set(false);

        this.teamsService.getOneTeam(teamId).subscribe({
            next: team => {
                this.team.set(team);
                this.isLoading.set(false);
            },
            error: () => {
                this.team.set(null);
                this.isError.set(true);
                this.isLoading.set(false);
            }
        });
    }
}
