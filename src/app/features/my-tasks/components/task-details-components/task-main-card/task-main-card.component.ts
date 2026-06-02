import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {TuiButton, TuiIcon, TuiHintDirective, TuiHint} from '@taiga-ui/core';
import {Location} from '@angular/common';
import {MyTask} from '../../../interfaces/my-tasks.interface';
import {TuiSkeleton} from '@taiga-ui/kit';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-task-main-card',
    imports: [
        TuiButton,
        TuiIcon,
        TuiHintDirective,
        TuiHint,
        TuiSkeleton,
        DatePipe
    ],
    templateUrl: './task-main-card.component.html',
    styleUrl: './task-main-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskMainCardComponent {
    private readonly location = inject(Location);

    readonly task = input<MyTask | null>(null);
    readonly isLoading = input(false);

    protected goBack() {
        this.location.back();
    }
}
