import {Component, inject, OnInit, signal} from '@angular/core';
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
import {TuiAvatar} from '@taiga-ui/kit';

import {Team} from '../../interfaces/team.interface';
import {TeamsService} from '../../services/teams.service';

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
        TuiAvatar
    ],
    templateUrl: './team-detail.component.html',
    styleUrl: './team-detail.component.less'
})
export class TeamDetailComponent implements OnInit {
    private readonly teamsService = inject(TeamsService);
    private readonly router = inject(Router);

    protected readonly isLoading = signal(false);
    protected readonly teams = signal<Team[]>([]);
    protected readonly isNoAccessDialogOpen = signal(false);

    ngOnInit(): void {
        this.loadTeams();
    }

    protected openTeamSettings(team: Team): void {
        if (team.myRole === 'OWNER' || team.myRole === 'ADMIN') {
            this.router.navigate(['/dashboard', 'teams', team.id, 'settings']);

            return;
        }

        this.isNoAccessDialogOpen.set(true);
    }

    private loadTeams(): void {
        this.isLoading.set(true);

        this.teamsService.getTeams().subscribe({
            next: teams => {
                this.teams.set(teams);
                this.isLoading.set(false);
            },
            error: error => {
                console.error('Не удалось загрузить команды', error);
                this.isLoading.set(false);
            }
        });
    }
}
