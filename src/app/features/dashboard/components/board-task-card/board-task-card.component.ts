import {DatePipe} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input
} from '@angular/core';
import {TuiAvatar} from '@taiga-ui/kit';
import {
    ProjectTask,
    TaskPriority
} from '../../../projects/interfaces/project-tasks.interface';
import {TuiButton, TuiHintDirective} from '@taiga-ui/core';
import {RouterLink} from '@angular/router';
import {ProjectBoardTask} from '../../../projects/interfaces/board.interface';

@Component({
    selector: 'app-board-task-card',
    imports: [DatePipe, TuiAvatar, TuiButton, TuiHintDirective, RouterLink],
    templateUrl: './board-task-card.component.html',
    styleUrl: './board-task-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardTaskCardComponent {
    readonly task = input.required<ProjectBoardTask>();

    protected getPriorityColor() {
        const colors: Record<TaskPriority, string> = {
            [TaskPriority.LOW]: 'var(--color-success)',
            [TaskPriority.MEDIUM]: 'var(--color-warning)',
            [TaskPriority.HIGH]: 'var(--color-stat-orange)',
            [TaskPriority.CRITICAL]: 'var(--color-danger)'
        };

        return colors[this.task().priority];
    }

    protected getPriorityBackground() {
        const backgrounds: Record<TaskPriority, string> = {
            [TaskPriority.LOW]: 'var(--color-success-bg-soft)',
            [TaskPriority.MEDIUM]: 'var(--color-warning-bg-soft)',
            [TaskPriority.HIGH]: 'var(--color-stat-orange-bg)',
            [TaskPriority.CRITICAL]: 'var(--color-danger-bg-soft)'
        };

        return backgrounds[this.task().priority];
    }

    protected readonly taskLink = computed(() => [
        '/dashboard/projects',
        this.task().projectId,
        'tasks',
        this.task().id
    ]);
}
