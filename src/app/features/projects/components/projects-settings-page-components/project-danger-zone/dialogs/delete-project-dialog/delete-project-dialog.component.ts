import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiDialogContext} from '@taiga-ui/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import {ProjectsService} from '../../../../../services/projects.service';
import {TuiButton} from '@taiga-ui/core';

@Component({
    selector: 'app-delete-project-dialog',
    imports: [TuiButton],
    templateUrl: './delete-project-dialog.component.html',
    styleUrl: './delete-project-dialog.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteProjectDialogComponent {
    protected readonly context =
        injectContext<TuiDialogContext<boolean, string>>();
    protected projectId = this.context.data;

    private readonly projectsService = inject(ProjectsService);

    protected deleteProject() {
        this.projectsService
            .deleteProject(this.projectId)
            .subscribe(() => this.context.completeWith(true));
    }

    protected cancel() {
        this.context.$implicit.complete();
    }
}
