import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {ProjectTask} from '../../../../projects/interfaces/project-tasks.interface';
import {TuiIcon} from '@taiga-ui/core';
import {TuiSkeleton} from '@taiga-ui/kit';

@Component({
    selector: 'app-task-content-card',
    imports: [TuiIcon, TuiSkeleton],
    templateUrl: './task-content-card.component.html',
    styleUrl: './task-content-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskContentCardComponent {
    readonly task = input<ProjectTask | null>(null);
    readonly isLoading = input(false);
}
