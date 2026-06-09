import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiDialogContext, TuiIcon, TuiButton} from '@taiga-ui/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import {ProjectRepository} from '../../../../interfaces/project-repositore.interface';

@Component({
    selector: 'app-all-project-repos',
    imports: [TuiIcon, TuiButton],
    templateUrl: './all-project-repos.component.html',
    styleUrl: './all-project-repos.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllProjectReposComponent {
    deleteRepo(arg0: any) {
        throw new Error('Method not implemented.');
    }
    protected readonly context =
        injectContext<TuiDialogContext<string, ProjectRepository[]>>();
    protected repos = this.context.data;
}
