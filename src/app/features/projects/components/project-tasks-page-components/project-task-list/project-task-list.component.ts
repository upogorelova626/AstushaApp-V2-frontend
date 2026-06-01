import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {ProjectTask} from '../../../interfaces/project-tasks.interface';
import {Project} from '../../../interfaces/project.interface';

@Component({
    selector: 'app-project-task-list',
    imports: [],
    templateUrl: './project-task-list.component.html',
    styleUrl: './project-task-list.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectTaskListComponent {
    tasks = input.required<ProjectTask[]>();
}
