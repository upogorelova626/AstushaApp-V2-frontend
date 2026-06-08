import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    signal
} from '@angular/core';
import {
    TuiButton,
    TuiDialog,
    TuiIcon,
    TuiNotificationService
} from '@taiga-ui/core';
import {ProjectsService} from '../../../services/projects.service';
import {Router} from '@angular/router';
import {finalize, switchMap} from 'rxjs';
import {CompleteProjectDialogComponent} from './dialogs/complete-project-dialog/complete-project-dialog.component';
import {DeleteProjectDialogComponent} from './dialogs/delete-project-dialog/delete-project-dialog.component';
import {TuiDialogService} from '@taiga-ui/core';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';

@Component({
    selector: 'app-project-danger-zone',
    imports: [TuiButton, TuiDialog, TuiIcon],
    templateUrl: './project-danger-zone.component.html',
    styleUrl: './project-danger-zone.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDangerZoneComponent {
    readonly projectId = input.required<string>();

    private readonly projectsService = inject(ProjectsService);
    private readonly router = inject(Router);
    private readonly alerts = inject(TuiNotificationService);

    protected readonly isDeleting = signal(false);

    protected isDeleteProjectDialogOpen = false;

    protected openDeleteProjectDialog() {
        this.isDeleteProjectDialogOpen = true;
    }

    protected closeDeleteProjectDialog() {
        this.isDeleteProjectDialogOpen = false;
    }

    protected deleteProject() {
        const projectId = this.projectId();
        if (!projectId) {
            return;
        }

        this.isDeleting.set(true);

        this.projectsService
            .deleteProject(projectId)
            .pipe(
                finalize(() => {
                    this.isDeleting.set(false);
                })
            )
            .subscribe(() => {
                this.isDeleteProjectDialogOpen = false;
                this.router.navigate(['/dashboard/projects']);
                this.alerts.open('Проект успешно удален');
            });
    }

    private readonly dialogs = inject(TuiDialogService);

    protected openCompleteProjectDialog(): void {
        this.dialogs
            .open<string>(
                new PolymorpheusComponent(CompleteProjectDialogComponent),
                {
                    label: 'Завершить проект?',
                    size: 's',
                    data: this.projectId
                }
            )
            .pipe(switchMap(name => this.alerts.open(name)))
            .subscribe();
    }
}
