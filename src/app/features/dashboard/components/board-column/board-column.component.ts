import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input
} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';

import {BoardTaskCardComponent} from '../board-task-card/board-task-card.component';
import {ProjectWorkflowStage} from '../../../projects/interfaces/project.interface';
import {ProjectTask} from '../../../projects/interfaces/project-tasks.interface';

@Component({
    selector: 'app-board-column',
    imports: [BoardTaskCardComponent, TuiButton],
    templateUrl: './board-column.component.html',
    styleUrl: './board-column.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardColumnComponent {
    readonly stage = input.required<ProjectWorkflowStage>();
    readonly tasks = input<ProjectTask[]>([]);

    protected readonly tasksCount = computed(() => {
        return this.tasks().length;
    });
}
