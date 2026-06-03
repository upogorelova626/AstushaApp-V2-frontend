import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TuiAvatar} from '@taiga-ui/kit';
import {ProjectTask} from '../../../projects/interfaces/project-tasks.interface';

@Component({
    selector: 'app-board-task-card',
    imports: [TuiAvatar],
    templateUrl: './board-task-card.component.html',
    styleUrl: './board-task-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardTaskCardComponent {
    readonly task = input<ProjectTask | null>(null);
}
