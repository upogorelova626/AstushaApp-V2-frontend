import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    OnInit,
    signal
} from '@angular/core';
import {
    TuiButton,
    TuiIcon,
    TuiNotificationService,
    TuiHint
} from '@taiga-ui/core';
import {finalize, switchMap, tap} from 'rxjs';
import {TuiSkeleton} from '@taiga-ui/kit';
import {Team} from '../../../../../shared/interfaces/team.interface';
import {ProjectsService} from '../../../../../shared/services/projects.service';
import {PluralizeRuPipe} from '../../../../../shared/pipes/pluralize-ru.pipe';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-project-team-settings',
    imports: [
        TuiButton,
        TuiIcon,
        TuiSkeleton,
        PluralizeRuPipe,
        TuiHint,
        RouterLink
    ],
    templateUrl: './project-team-settings.component.html',
    styleUrl: './project-team-settings.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectTeamSettingsComponent implements OnInit {
    readonly projectId = input.required<string>();

    private readonly projectsService = inject(ProjectsService);
    private readonly alerts = inject(TuiNotificationService);

    protected readonly team = signal<Team | null>(null);
    protected readonly isLoading = signal(false);

    ngOnInit() {
        this.loadProjectTeam();
    }

    private loadProjectTeam() {
        this.isLoading.set(true);

        this.projectsService
            .getProjectTeam(this.projectId())
            .pipe(
                finalize(() => {
                    this.isLoading.set(false);
                })
            )
            .subscribe(team => {
                this.team.set(team);
            });
    }

    removeProjectTeam() {
        const projectId = this.projectId();
        const teamId = this.team()?.id;
        if (!teamId || !projectId) {
            return;
        }
        this.projectsService
            .removeProjectTeam(projectId, teamId)
            .pipe(
                tap(() => {
                    this.team.set(null);
                }),
                switchMap(() =>
                    this.alerts.open('Команда успешно отвязана от проекта')
                )
            )
            .subscribe();
    }
}
