import {DatePipe} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input
} from '@angular/core';
import {TuiAvatar, TuiBadge} from '@taiga-ui/kit';
import {TuiButton, TuiHintDirective} from '@taiga-ui/core';
import {RouterLink} from '@angular/router';
import {ProjectBoardTask} from '../../../projects/interfaces/board.interface';

@Component({
    selector: 'app-board-task-card',
    imports: [
        DatePipe,
        TuiAvatar,
        TuiButton,
        TuiHintDirective,
        RouterLink,
        TuiBadge
    ],
    templateUrl: './board-task-card.component.html',
    styleUrl: './board-task-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardTaskCardComponent {
    readonly task = input.required<ProjectBoardTask>();

    protected readonly taskLink = computed(() => [
        '/dashboard/projects',
        this.task().projectId,
        'tasks',
        this.task().id
    ]);
}
