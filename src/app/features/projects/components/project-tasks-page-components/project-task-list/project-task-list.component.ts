import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'app-project-task-list',
    imports: [],
    templateUrl: './project-task-list.component.html',
    styleUrl: './project-task-list.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectTaskListComponent {}
