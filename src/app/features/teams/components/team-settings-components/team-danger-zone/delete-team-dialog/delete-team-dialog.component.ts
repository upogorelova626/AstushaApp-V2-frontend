import {Component, inject} from '@angular/core';
import {TuiButton, type TuiDialogContext} from '@taiga-ui/core';
import {TeamsService} from '../../../../../../shared/services/teams.service';
import {injectContext} from '@taiga-ui/polymorpheus';

@Component({
    selector: 'app-delete-team-dialog',
    imports: [TuiButton],
    templateUrl: './delete-team-dialog.component.html',
    styleUrl: './delete-team-dialog.component.less'
})
export class DeleteTeamDialogComponent {
    protected readonly context =
        injectContext<TuiDialogContext<boolean, string>>();
    private readonly teamId = this.context.data;

    private readonly teamsService = inject(TeamsService);

    protected deleteTeam() {
        const teamId = this.teamId;
        if (!teamId) {
            return;
        }

        this.teamsService.deleteTeam(teamId).subscribe(() => {
            this.context.completeWith(true);
        });
    }

    cancel() {
        this.context.$implicit.complete();
    }
}
