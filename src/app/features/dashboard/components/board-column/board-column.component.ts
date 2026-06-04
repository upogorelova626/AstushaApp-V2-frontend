import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output
} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';
import {TuiButton} from '@taiga-ui/core';

import {BoardTaskCardComponent} from '../board-task-card/board-task-card.component';
import {ProjectWorkflowStage} from '../../../projects/interfaces/project.interface';
import {ProjectBoardTask} from '../../../projects/interfaces/board.interface';

@Component({
    selector: 'app-board-column',
    imports: [BoardTaskCardComponent, TuiButton, CdkDropList, CdkDrag],
    templateUrl: './board-column.component.html',
    styleUrl: './board-column.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardColumnComponent {
    readonly stage = input.required<ProjectWorkflowStage>();
    readonly tasks = input<ProjectBoardTask[]>([]);
    readonly connectedDropLists = input<string[]>([]);

    readonly taskDropped = output<{
        event: CdkDragDrop<ProjectBoardTask[]>;
        targetStageId: string;
    }>();

    protected readonly tasksCount = computed(() => {
        return this.tasks().length;
    });

    protected readonly dropListId = computed(() => {
        return `board-stage-${this.stage().id}`;
    });

    protected drop(event: CdkDragDrop<ProjectBoardTask[]>): void {
        this.taskDropped.emit({
            event,
            targetStageId: this.stage().id
        });
    }
}
