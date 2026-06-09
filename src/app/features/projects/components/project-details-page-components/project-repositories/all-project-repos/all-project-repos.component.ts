import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject
} from '@angular/core';
import {TuiDialogContext, TuiIcon, TuiButton} from '@taiga-ui/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import {ProjectRepository} from '../../../../interfaces/project-repositore.interface';
import {ProjectRepositoriesService} from '../../../../services/project-repositories.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-all-project-repos',
    imports: [TuiIcon, TuiButton],
    templateUrl: './all-project-repos.component.html',
    styleUrl: './all-project-repos.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllProjectReposComponent {
    protected readonly context =
        injectContext<TuiDialogContext<boolean, ProjectRepository[]>>();
    protected readonly repos = this.context.data;

    private readonly projectReposService = inject(ProjectRepositoriesService);
    private readonly destroyRef = inject(DestroyRef);

    protected deleteRepo(projectId: string, repoId: string) {
        this.projectReposService
            .deleteRepo(projectId, repoId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.context.completeWith(true);
            });
    }
}
