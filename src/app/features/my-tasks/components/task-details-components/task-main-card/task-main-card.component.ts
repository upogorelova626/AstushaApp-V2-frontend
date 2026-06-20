import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    output
} from '@angular/core';
import {Location, DatePipe} from '@angular/common';
import {
    TuiButton,
    TuiDialogService,
    TuiHint,
    TuiHintDirective,
    TuiIcon,
    TuiNotificationService
} from '@taiga-ui/core';
import {TuiAvatar, TuiSkeleton} from '@taiga-ui/kit';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {switchMap, tap} from 'rxjs';
import {ProjectTask} from '../../../../projects/interfaces/project-tasks.interface';
import {EditTaskDialogComponent} from './edit-task-dialog/edit-task-dialog.component';

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
    private readonly dialogs = inject(TuiDialogService);
    private readonly alerts = inject(TuiNotificationService);

    readonly task = input<ProjectTask | null>(null);
    readonly isLoading = input(false);

    readonly taskUpdated = output<ProjectTask>();

    protected goBack(): void {
        this.location.back();
    }

    protected editTask(): void {
        const task = this.task();

        if (!task) {
            return;
        }

        this.dialogs
            .open<ProjectTask>(
                new PolymorpheusComponent(EditTaskDialogComponent),
                {
                    label: 'Редактирование задачи',
                    size: 'm',
                    data: task
                }
            )
            .pipe(
                tap(updatedTask => {
                    this.taskUpdated.emit(updatedTask);
                }),
                switchMap(() =>
                    this.alerts.open('Изменения успешно сохранены!')
                )
            )
            .subscribe();
    }
}
