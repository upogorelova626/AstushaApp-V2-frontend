import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {
    TuiDialogContext,
    TuiButton,
    TuiNotificationService
} from '@taiga-ui/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import {ProjectsService} from '../../../../../services/projects.service';
import {catchError, EMPTY} from 'rxjs';

@Component({
    selector: 'app-complete-project-dialog',
    imports: [TuiButton],
    templateUrl: './complete-project-dialog.component.html',
    styleUrl: './complete-project-dialog.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompleteProjectDialogComponent {
    protected readonly context =
        injectContext<TuiDialogContext<boolean, string>>();
    protected projectId = this.context.data;
    private readonly projectsService = inject(ProjectsService);

    private readonly alerts = inject(TuiNotificationService);

    protected completeProject() {
        this.projectsService
            .completeProject(this.projectId, {})
            .pipe(
                catchError(() => {
                    this.alerts
                        .open(
                            'Нельзя завершить проект, пока в нем есть незавершенные задачи',
                            {
                                label: 'Проект не завершён',
                                appearance: 'warning'
                            }
                        )
                        .subscribe();
                    return EMPTY;
                })
            )
            .subscribe(() => this.context.completeWith(true));
    }

    protected cancel() {
        this.context.$implicit.complete();
    }
}
