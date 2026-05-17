import {Component, inject, OnInit, signal} from '@angular/core';
import {TuiTextfield, TuiInput, TuiButton} from '@taiga-ui/core';

import {TeamsService} from '../../services/teams.service';
import {Team} from '../../interfaces/team.interface';

@Component({
    selector: 'app-team-detail',
    imports: [TuiTextfield, TuiInput, TuiButton],
    templateUrl: './team-detail.component.html',
    styleUrl: './team-detail.component.less'
})
export class TeamDetailComponent implements OnInit {
    private readonly teamsService = inject(TeamsService);

    protected readonly isLoading = signal(false);

    teams = signal<Team[]>([]);

    ngOnInit(): void {
        this.loadTeams();
    }

    private loadTeams() {
        this.isLoading.set(true);

        this.teamsService.getTeams().subscribe({
            next: teams => {
                this.teams.set(teams);
                this.isLoading.set(false);
            }
        });
    }
}
