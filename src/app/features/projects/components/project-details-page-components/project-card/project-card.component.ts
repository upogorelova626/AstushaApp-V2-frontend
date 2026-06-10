import {DatePipe} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    input,
    signal
} from '@angular/core';
import {TuiIcon} from '@taiga-ui/core';
import {Project, ProjectListItem} from '../../../interfaces/project.interface';
import {ProjectWorkflowPipe} from '../../../../../shared/pipes/project-workflow.pipe';
import {ProjectPriorityPipe} from '../../../../../shared/pipes/project-priority.pipe';
import {Team} from '../../../../teams/interfaces/team.interface';
import {ProjectsService} from '../../../services/projects.service';
import {tap} from 'rxjs';

@Component({
    selector: 'app-project-card',
    imports: [TuiIcon, DatePipe, ProjectWorkflowPipe, ProjectPriorityPipe],
    templateUrl: './project-card.component.html',
    styleUrl: './project-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectCardComponent {
    readonly project = input<ProjectListItem | null>(null);

    private readonly projectsService = inject(ProjectsService);

    protected readonly team = signal<Team | null>(null);

    constructor() {
        effect(() => {
            const project = this.project();

            if (!project) {
                this.team.set(null);

                return;
            }
            const projectId = project.id;

            this.projectsService
                .getProjectTeam(projectId)
                .pipe(
                    tap(team => {
                        this.team.set(team);
                    })
                )
                .subscribe();
        });
    }
}
