import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiDialogContext, TuiButton} from '@taiga-ui/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import {ProjectsService} from '../../../../../services/projects.service';
import {Project} from '../../../../../interfaces/project.interface';

@Component({
    selector: 'app-complete-project-dialog',
    imports: [TuiButton],
    templateUrl: './complete-project-dialog.component.html',
    styleUrl: './complete-project-dialog.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompleteProjectDialogComponent {
    protected readonly context =
        injectContext<TuiDialogContext<Project, string>>();
    protected projectId = this.context.data;

    private readonly projectsService = inject(ProjectsService);

    protected completeProject() {
        this.projectsService
            .completeProject(this.projectId, {})
            .subscribe(project => {
                this.context.completeWith(project);
            });
    }

    protected cancel() {
        this.context.$implicit.complete();
    }
}
