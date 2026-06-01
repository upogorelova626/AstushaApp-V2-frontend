import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {ProjectTask} from '../../../interfaces/project-tasks.interface';
import {TuiButton, TuiInput} from '@taiga-ui/core';

@Component({
    selector: 'app-project-task-toolbar',
    imports: [TuiButton, TuiInput],
    templateUrl: './project-task-toolbar.component.html',
    styleUrl: './project-task-toolbar.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectTaskToolbarComponent {
    tasks = input.required<ProjectTask[]>();
}
