import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TuiButton, TuiHint} from '@taiga-ui/core';
import {TuiAvatar} from '@taiga-ui/kit';
import {ProjectListItem} from '../../../interfaces/project.interface';
import {DatePipe} from '@angular/common';
import {ProjectStatusPipe} from '../../../../../shared/pipes/project-status.pipe';
import {TuiSkeleton} from '@taiga-ui/kit';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-projects-list',
    imports: [
        TuiButton,
        TuiAvatar,
        TuiSkeleton,
        TuiHint,
        RouterLink,
        DatePipe,
        ProjectStatusPipe
    ],
    templateUrl: './projects-list.component.html',
    styleUrl: './projects-list.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsListComponent {
    readonly projects = input<ProjectListItem[]>([]);
    readonly isProjectsLoading = input(false);
}
