import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TuiIcon} from '@taiga-ui/core';
import {TuiSkeleton} from '@taiga-ui/kit';

import {ProjectListItem} from '../../../interfaces/projects.interface';
import {ProjectWorkflowPipe} from '../../../../../shared/pipes/project-workflow.pipe';
import {ProjectPriorityPipe} from '../../../../../shared/pipes/project-priority.pipe';

@Component({
    selector: 'app-project-card',
    imports: [
        TuiIcon,
        TuiSkeleton,
        DatePipe,
        ProjectWorkflowPipe,
        ProjectPriorityPipe
    ],
    templateUrl: './project-card.component.html',
    styleUrl: './project-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectCardComponent {
    readonly project = input<ProjectListItem | null>(null);
    readonly isLoading = input(false);
}
