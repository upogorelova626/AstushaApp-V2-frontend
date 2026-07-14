import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    inject,
    Injector,
    input,
    OnInit,
    signal
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
    TuiButton,
    TuiDialogService,
    TuiIcon,
    TuiNotificationService
} from '@taiga-ui/core';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {filter, finalize, switchMap, tap} from 'rxjs';
import {Project} from '../../../interfaces/project.interface';
import {ProjectRepository} from '../../../interfaces/project-repositore.interface';
import {ProjectRepositoriesService} from '../../../services/project-repositories.service';
import {AddRepoLinkComponent} from './add-repo-link/add-repo-link.component';
import {RepositoryHrefPipe} from '../../../../../shared/pipes/repository-href.pipe';
import {TuiSkeleton} from '@taiga-ui/kit';
import {AllProjectReposComponent} from './all-project-repos/all-project-repos.component';

@Component({
    selector: 'app-project-repositories',
    imports: [TuiButton, TuiIcon, RepositoryHrefPipe, TuiSkeleton],
    templateUrl: './project-repositories.component.html',
    styleUrl: './project-repositories.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectRepositoriesComponent implements OnInit {
    readonly project = input<Project | null>(null);
    readonly canManageProject = input(false);

    private readonly projectReposService = inject(ProjectRepositoriesService);
    private readonly injector = inject(Injector);
    private readonly alerts = inject(TuiNotificationService);
    private readonly dialogs = inject(TuiDialogService);
    private readonly destroyRef = inject(DestroyRef);

    protected readonly repos = signal<ProjectRepository[]>([]);
    protected readonly isLoading = signal(false);

    ngOnInit() {
        const project = this.project();

        if (!project) {
            return;
        }

        this.loadRepos(project.id);
    }

    protected addLink() {
        const project = this.project();

        if (!project) {
            return;
        }

        this.dialogs
            .open<boolean>(
                new PolymorpheusComponent(AddRepoLinkComponent, this.injector),
                {
                    label: 'Добавьте ссылку на репозиторий',
                    size: 's',
                    data: project
                }
            )
            .pipe(
                filter(Boolean),
                switchMap(() => this.projectReposService.getRepos(project.id)),
                tap(repos => {
                    this.repos.set(repos);
                }),
                switchMap(() =>
                    this.alerts.open('Ссылка на репозиторий добавлена')
                ),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    private loadRepos(projectId: string) {
        this.isLoading.set(true);

        this.projectReposService
            .getRepos(projectId)
            .pipe(
                finalize(() => {
                    this.isLoading.set(false);
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(repos => {
                this.repos.set(repos);
            });
    }

    protected previewRepos = computed(() => {
        const repos = this.repos();
        return repos.slice(0, 3);
    });

    protected deleteRepo(repoId: string) {
        const projectId = this.project()?.id;

        if (!projectId) {
            return;
        }

        this.projectReposService
            .deleteRepo(projectId, repoId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.repos.update(repos =>
                    repos.filter(repo => repo.id !== repoId)
                );
            });
    }

    showAllRepos() {
        const repos = this.repos();
        const project = this.project();
        const canManageProject = this.canManageProject();

        if (!project) {
            return;
        }

        this.dialogs
            .open<boolean>(
                new PolymorpheusComponent(AllProjectReposComponent),
                {
                    label: 'Все репозитории',
                    size: 'l',
                    data: {repos, canManageProject}
                }
            )
            .pipe(
                filter(Boolean),
                switchMap(() => this.projectReposService.getRepos(project.id)),
                tap(repos => {
                    this.repos.set(repos);
                }),
                switchMap(() =>
                    this.alerts.open('Ссылка на репозиторий успешно удалена')
                ),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }
}
