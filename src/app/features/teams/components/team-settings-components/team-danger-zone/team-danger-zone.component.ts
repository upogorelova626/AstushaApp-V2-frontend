import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TuiButton, TuiDialog, TuiIcon} from '@taiga-ui/core';
import {TeamsService} from '../../../services/teams.service';

@Component({
    selector: 'app-team-danger-zone',
    imports: [TuiButton, TuiDialog, TuiIcon],
    templateUrl: './team-danger-zone.component.html',
    styleUrl: './team-danger-zone.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamDangerZoneComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly teamsService = inject(TeamsService);

    protected isDeleteTeamDialogOpen = false;

    protected openDeleteTeamDialog() {
        this.isDeleteTeamDialogOpen = true;
    }

    protected closeDeleteTeamDialog() {
        this.isDeleteTeamDialogOpen = false;
    }

    protected deleteTeam() {
        const teamId = this.route.snapshot.paramMap.get('teamId');

        if (!teamId) {
            return;
        }

        this.teamsService.deleteTeam(teamId).subscribe(() => {
            this.isDeleteTeamDialogOpen = false;
            this.router.navigate(['/dashboard/teams']);
        });
    }
}
