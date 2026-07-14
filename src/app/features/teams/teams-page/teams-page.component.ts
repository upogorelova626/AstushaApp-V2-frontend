import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {TeamDetailComponent} from '../components/teams-components/team-detail/team-detail.component';
import {TeamListComponent} from '../components/teams-components/teams-list/teams-list.component';

@Component({
    selector: 'app-teams-page',
    imports: [TeamDetailComponent, TeamListComponent],
    templateUrl: './teams-page.component.html',
    styleUrl: './teams-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamsPageComponent {
    protected readonly selectedTeamId = signal<string | null>(null);

    protected selectTeam(teamId: string) {
        this.selectedTeamId.set(teamId);
    }
}
