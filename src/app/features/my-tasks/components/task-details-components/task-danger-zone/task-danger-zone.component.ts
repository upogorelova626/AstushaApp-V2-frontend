import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject,
    Injector,
    input
} from '@angular/core';
import {
    TuiButton,
    TuiDialogService,
    TuiIcon,
    TuiNotificationService
} from '@taiga-ui/core';
import {ProjectTask} from '../../../../projects/interfaces/project-tasks.interface';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {filter, switchMap, tap, timer} from 'rxjs';
import {DeleteTaskDialogComponent} from './delete-task-dialog/delete-task-dialog.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Location} from '@angular/common';
import {TuiSkeleton} from '@taiga-ui/kit';

@Component({
    selector: 'app-task-danger-zone',
    imports: [TuiIcon, TuiButton, TuiSkeleton],
    templateUrl: './task-danger-zone.component.html',
    styleUrl: './task-danger-zone.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskDangerZoneComponent {
    readonly task = input<ProjectTask | null>(null);
    private readonly injector = inject(Injector);
    private readonly dialogs = inject(TuiDialogService);
    private readonly alerts = inject(TuiNotificationService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly location = inject(Location);

    readonly isLoading = input(false);

    protected openDeleteTaskDialog() {
        const task = this.task();
        if (!task) {
            return;
        }
        this.dialogs
            .open<boolean>(
                new PolymorpheusComponent(
                    DeleteTaskDialogComponent,
                    this.injector
                ),
                {
                    label: 'Удалить задачу?',
                    size: 's',
                    data: task
                }
            )
            .pipe(
                filter(Boolean),
                tap(() => {
                    this.alerts.open('Задача успешно удалена!').subscribe();
                }),
                switchMap(() => timer(1200)),
                tap(() => {
                    this.location.back();
                }),
                takeUntilDestroyed(this.destroyRef)
            )

            .subscribe();
    }
}
