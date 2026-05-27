import {
    ChangeDetectionStrategy,
    Component,
    effect,
    inject,
    input,
    signal
} from '@angular/core';
import {
    TuiButton,
    TuiDialogService,
    TuiIcon,
    TuiNotificationService
} from '@taiga-ui/core';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {switchMap, tap} from 'rxjs';

import {Team} from '../../../../teams/interfaces/team.interface';
import {ProjectListItem} from '../../../interfaces/project.interface';
import {ProjectsService} from '../../../services/projects.service';
import {AddTeamDialogComponent} from './add-team-dialog/add-team-dialog.component';

@Component({
    selector: 'app-project-team-card',
    imports: [TuiButton, TuiIcon],
    templateUrl: './project-team-card.component.html',
    styleUrl: './project-team-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectTeamCardComponent {
    private readonly alerts = inject(TuiNotificationService);
    private readonly dialogs = inject(TuiDialogService);
    private readonly projectsService = inject(ProjectsService);

    readonly project = input<ProjectListItem | null>(null);

    protected readonly team = signal<Team | null>(null);

    constructor() {
        effect(() => {
            const project = this.project();

            if (!project) {
                this.team.set(null);

                return;
            }

            this.getTeam(project.id).subscribe();
        });
    }

    protected click() {
        const project = this.project();

        if (!project) {
            return;
        }

        this.dialogs
            .open<string>(new PolymorpheusComponent(AddTeamDialogComponent), {
                label: 'Добавьте команду в проект',
                size: 's',
                data: project.id
            })
            .pipe(
                switchMap(teamId => this.addTeamToProject(project.id, teamId)),
                tap(projectTeam => {
                    this.team.set(projectTeam.team);
                }),
                switchMap(() => this.alerts.open('Команда добавлена в проект'))
            )
            .subscribe();
    }

    private addTeamToProject(projectId: string, teamId: string) {
        return this.projectsService.addTeamToProject(projectId, {
            teamId
        });
    }

    private getTeam(projectId: string) {
        return this.projectsService.getProjectTeam(projectId).pipe(
            tap(team => {
                this.team.set(team);
            })
        );
    }
}
