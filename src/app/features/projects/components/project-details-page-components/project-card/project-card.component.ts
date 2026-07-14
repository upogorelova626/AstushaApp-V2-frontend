import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TuiIcon} from '@taiga-ui/core';
import {ProjectListItem} from '../../../interfaces/project.interface';
import {ProjectWorkflowPipe} from '../../../../../shared/pipes/project-workflow.pipe';
import {ProjectPriorityPipe} from '../../../../../shared/pipes/project-priority.pipe';
import {Team} from '../../../../teams/interfaces/team.interface';

import {TuiSkeleton} from '@taiga-ui/kit';

@Component({
    selector: 'app-project-card',
    imports: [
        TuiIcon,
        DatePipe,
        ProjectWorkflowPipe,
        ProjectPriorityPipe,
        TuiSkeleton
    ],
    templateUrl: './project-card.component.html',
    styleUrl: './project-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectCardComponent {
    readonly project = input<ProjectListItem | null>(null);
    readonly team = input<Team | null>(null);
    readonly isTeamLoading = input(false);
}
