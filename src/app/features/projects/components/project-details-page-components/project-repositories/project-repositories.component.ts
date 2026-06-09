import {
    ChangeDetectionStrategy,
    Component,
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
import {RepositoryNamePipe} from '../../../../../shared/pipes/reposirory-name.pipe';
import {RepositoryHrefPipe} from '../../../../../shared/pipes/repository-href.pipe';

@Component({
    selector: 'app-project-repositories',
    imports: [TuiButton, TuiIcon, RepositoryNamePipe, RepositoryHrefPipe],
    templateUrl: './project-repositories.component.html',
    styleUrl: './project-repositories.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectRepositoriesComponent implements OnInit {
    readonly project = input<Project | null>(null);

    private readonly projectReposService = inject(ProjectRepositoriesService);
    private readonly injector = inject(Injector);
    private readonly alerts = inject(TuiNotificationService);
    private readonly dialogs = inject(TuiDialogService);
    private readonly destroyRef = inject(DestroyRef);

    protected readonly repos = signal<ProjectRepository[]>([]);
    protected readonly isLoading = signal(false);

    ngOnInit(): void {
        const project = this.project();

        if (!project) {
            return;
        }

        this.loadRepos(project.id);
    }

    protected addLink(): void {
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

    private loadRepos(projectId: string): void {
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
}
