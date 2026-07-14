import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    output
} from '@angular/core';
import {
    TuiButton,
    TuiDialogService,
    TuiIcon,
    TuiLoader,
    TuiNotificationService
} from '@taiga-ui/core';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {RouterLink} from '@angular/router';
import {catchError, EMPTY, switchMap, tap} from 'rxjs';

import {
    ProjectTeam,
    Team
} from '../../../../../shared/interfaces/team.interface';
import {ProjectListItem} from '../../../../../shared/interfaces/project.interface';
import {ProjectsService} from '../../../../../shared/services/projects.service';
import {AddTeamDialogComponent} from './add-team-dialog/add-team-dialog.component';

@Component({
    selector: 'app-project-team-card',
    imports: [TuiButton, TuiIcon, RouterLink, TuiLoader],
    templateUrl: './project-team-card.component.html',
    styleUrl: './project-team-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectTeamCardComponent {
    private readonly alerts = inject(TuiNotificationService);
    private readonly dialogs = inject(TuiDialogService);
    private readonly projectsService = inject(ProjectsService);

    readonly project = input<ProjectListItem | null>(null);
    readonly team = input<Team | null>(null);
    readonly isLoading = input(false);
    readonly canManageProject = input(false);

    readonly teamChanged = output<Team | null>();

    protected click(): void {
        const project = this.project();

        if (!project) {
            return;
        }

        this.dialogs
            .open<ProjectTeam>(
                new PolymorpheusComponent(AddTeamDialogComponent),
                {
                    label: 'Добавьте команду в проект',
                    size: 's',
                    data: project.id
                }
            )
            .pipe(
                tap(projectTeam => {
                    this.teamChanged.emit(projectTeam.team);
                }),
                switchMap(() => this.alerts.open('Команда добавлена в проект')),
                catchError(() => EMPTY)
            )
            .subscribe();
    }

    protected removeProjectTeam(): void {
        const projectId = this.project()?.id;
        const teamId = this.team()?.id;

        if (!teamId || !projectId) {
            return;
        }

        this.projectsService
            .removeProjectTeam(projectId, teamId)
            .pipe(
                tap(() => {
                    this.teamChanged.emit(null);
                }),
                switchMap(() =>
                    this.alerts.open('Команда успешно отвязана от проекта')
                ),
                catchError(() => EMPTY)
            )
            .subscribe();
    }
}
