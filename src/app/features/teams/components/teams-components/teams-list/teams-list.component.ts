import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    Injector,
    OnInit,
    output,
    signal
} from '@angular/core';

import {
    TuiButton,
    TuiDialogService,
    TuiError,
    TuiHint,
    TuiIcon,
    TuiInput,
    TuiLoader,
    TuiTextfield
} from '@taiga-ui/core';
import {TuiTextarea} from '@taiga-ui/kit';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {filter, finalize} from 'rxjs';
import {TeamRoleLabelPipe} from '../../../../../shared/pipes/team-role-label.pipe';
import {Team} from '../../../interfaces/team.interface';
import {TeamsService} from '../../../services/teams.service';
import {AllTeamsDialogComponent} from './all-teams-dialog/all-teams-dialog.component';
import {CreateTeamDialogComponent} from './create-team-dialog/create-team-dialog.component';

@Component({
    selector: 'app-teams-list',
    imports: [
        TuiButton,
        TuiHint,
        TuiIcon,
        TuiInput,
        TuiLoader,
        TuiTextfield,
        TeamRoleLabelPipe
    ],
    templateUrl: './teams-list.component.html',
    styleUrl: './teams-list.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamListComponent implements OnInit {
    private readonly teamsService = inject(TeamsService);
    private readonly dialogs = inject(TuiDialogService);
    private readonly injector = inject(Injector);

    readonly teamSelected = output<string>();

    protected readonly teams = signal<Team[]>([]);
    protected readonly isLoading = signal(false);

    protected readonly previewTeams = computed(() => this.teams().slice(0, 5));

    ngOnInit() {
        this.loadTeams();
    }

    protected selectTeam(teamId: string) {
        this.teamSelected.emit(teamId);
    }

    protected openCreateTeamDialog() {
        this.dialogs
            .open<boolean>(
                new PolymorpheusComponent(
                    CreateTeamDialogComponent,
                    this.injector
                ),
                {
                    label: 'Создать команду',
                    size: 'm'
                }
            )
            .pipe(filter(Boolean))
            .subscribe(() => {
                this.loadTeams();
            });
    }

    protected openAllTeamsDialog() {
        this.dialogs
            .open<string>(
                new PolymorpheusComponent(
                    AllTeamsDialogComponent,
                    this.injector
                ),
                {
                    label: 'Мои команды',
                    size: 'm',
                    data: this.teams()
                }
            )
            .pipe(filter(Boolean))
            .subscribe(teamId => {
                this.selectTeam(teamId);
            });
    }

    private loadTeams() {
        this.isLoading.set(true);

        this.teamsService
            .getTeams()
            .pipe(
                finalize(() => {
                    this.isLoading.set(false);
                })
            )
            .subscribe(teams => {
                this.teams.set(teams);
            });
    }
}
