import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {TuiIcon} from '@taiga-ui/core';
import {Project} from '../../../interfaces/project.interface';

@Component({
    selector: 'app-project-repositories',
    imports: [TuiButton, TuiIcon],
    templateUrl: './project-repositories.component.html',
    styleUrl: './project-repositories.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectRepositoriesComponent {
    readonly project = input<Project | null>(null);
}
