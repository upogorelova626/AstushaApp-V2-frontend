import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    signal
} from '@angular/core';
import {TuiButton, TuiIcon, TuiNotificationService} from '@taiga-ui/core';
import {ProjectsService} from '../../../../../shared/services/projects.service';
import {Router} from '@angular/router';
import {CompleteProjectDialogComponent} from './dialogs/complete-project-dialog/complete-project-dialog.component';
import {DeleteProjectDialogComponent} from './dialogs/delete-project-dialog/delete-project-dialog.component';
import {TuiDialogService} from '@taiga-ui/core';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {ProjectStatus} from '../../../../../shared/interfaces/project.enums';

@Component({
    selector: 'app-project-danger-zone',
    imports: [TuiButton, TuiIcon],
    templateUrl: './project-danger-zone.component.html',
    styleUrl: './project-danger-zone.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDangerZoneComponent {
    readonly projectId = input.required<string>();
    readonly projectStatus = input.required<string>();

    private readonly projectsService = inject(ProjectsService);
    private readonly router = inject(Router);
    private readonly alerts = inject(TuiNotificationService);
    private readonly dialogs = inject(TuiDialogService);

    protected readonly isDeleting = signal(false);

    protected openCompleteProjectDialog() {
        this.dialogs
            .open<boolean>(
                new PolymorpheusComponent(CompleteProjectDialogComponent),
                {
                    label: 'Завершить проект?',
                    size: 's',
                    data: this.projectId()
                }
            )
            .subscribe(isCompleted => {
                if (!isCompleted) {
                    return;
                }

                this.alerts
                    .open('Проект успешно завершён', {
                        label: 'Готово',
                        appearance: 'success'
                    })
                    .subscribe();
            });
    }

    protected openDeleteProjectDialog() {
        this.dialogs
            .open<boolean>(
                new PolymorpheusComponent(DeleteProjectDialogComponent),
                {
                    label: 'Удалить проект?',
                    size: 's',
                    data: this.projectId()
                }
            )
            .subscribe(isDeleted => {
                if (!isDeleted) {
                    return;
                }

                this.alerts
                    .open('Проект успешно удалён', {
                        label: 'Готово',
                        appearance: 'success'
                    })
                    .subscribe();

                this.router.navigate(['/dashboard/projects']);
            });
    }

    protected isProjectActive = computed(() => {
        return this.projectStatus() === ProjectStatus.ACTIVE;
    });
}
