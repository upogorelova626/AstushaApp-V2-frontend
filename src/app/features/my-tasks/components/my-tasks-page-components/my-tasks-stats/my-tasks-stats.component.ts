import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input
} from '@angular/core';
import {TuiAvatar, TuiSkeleton} from '@taiga-ui/kit';
import {MyTask} from '../../../interfaces/my-tasks.interface';

@Component({
    selector: 'app-my-tasks-stats',
    imports: [TuiAvatar, TuiSkeleton],
    templateUrl: './my-tasks-stats.component.html',
    styleUrl: './my-tasks-stats.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyTasksStatsComponent {
    readonly tasks = input<MyTask[]>([]);
    readonly isLoading = input(false);

    protected readonly allMyTasks = computed(() => {
        return this.tasks().length;
    });

    protected readonly todoCount = computed(() => {
        return this.tasks().filter(task => {
            return task.workflowStage.isStart === true;
        }).length;
    });

    protected readonly inWork = computed(() => {
        return this.tasks().filter(task => {
            return (
                !task.workflowStage.isFinal === true &&
                !task.workflowStage.isStart === true
            );
        }).length;
    });

    //protected readonly inCheck = computed(() => {});

    protected readonly done = computed(() => {
        return this.tasks().filter(task => {
            return task.workflowStage.isFinal === true;
        }).length;
    });

    protected readonly overdueCount = computed(() => {
        const today = new Date();

        return this.tasks().filter(task => {
            if (!task.dueDate || task.workflowStage?.isFinal) {
                return false;
            }

            return new Date(task.dueDate) < today;
        }).length;
    });
}
