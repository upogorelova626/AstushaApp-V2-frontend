import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {TuiButton, TuiIcon, TuiHintDirective, TuiHint} from '@taiga-ui/core';
import {Location} from '@angular/common';
import {TuiAvatar} from '@taiga-ui/kit';
import {TuiSkeleton} from '@taiga-ui/kit';
import {DatePipe} from '@angular/common';
import {ProjectTask} from '../../../../projects/interfaces/project-tasks.interface';

@Component({
    selector: 'app-task-main-card',
    imports: [
        TuiButton,
        TuiIcon,
        TuiHintDirective,
        TuiHint,
        TuiSkeleton,
        DatePipe,
        TuiAvatar
    ],
    templateUrl: './task-main-card.component.html',
    styleUrl: './task-main-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskMainCardComponent {
    private readonly location = inject(Location);

    readonly task = input<ProjectTask | null>(null);
    readonly isLoading = input(false);

    protected goBack() {
        this.location.back();
    }
}
