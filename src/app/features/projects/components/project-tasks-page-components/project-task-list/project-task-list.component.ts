import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {ProjectTask} from '../../../../../shared/interfaces/project-tasks.interface';
import {DatePipe} from '@angular/common';
import {TuiButton, TuiHintDirective} from '@taiga-ui/core';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-project-task-list',
    imports: [DatePipe, TuiButton, RouterLink, TuiHintDirective],
    templateUrl: './project-task-list.component.html',
    styleUrl: './project-task-list.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectTaskListComponent {
    tasks = input.required<ProjectTask[]>();
}
