import {ChangeDetectionStrategy, Component, output} from '@angular/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import {
    TuiButton,
    type TuiDialogContext,
    TuiInput,
    TuiIcon
} from '@taiga-ui/core';
import {Team} from '../../../../interfaces/team.interface';
import {TeamRoleLabelPipe} from '../../../../../../shared/pipes/team-role-label.pipe';

@Component({
    selector: 'app-all-teams-dialog',
    imports: [TuiButton, TuiInput, TeamRoleLabelPipe, TuiIcon],
    templateUrl: './all-teams-dialog.component.html',
    styleUrl: './all-teams-dialog.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllTeamsDialogComponent {
    protected readonly context =
        injectContext<TuiDialogContext<string, Team[]>>();
    protected teams = this.context.data;

    protected selectTeam(teamId: string) {
        this.context.completeWith(teamId);
    }
}
