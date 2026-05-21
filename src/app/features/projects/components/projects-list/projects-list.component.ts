import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {TuiAvatar} from '@taiga-ui/kit';

@Component({
    selector: 'app-projects-list',
    imports: [TuiButton, TuiAvatar],
    templateUrl: './projects-list.component.html',
    styleUrl: './projects-list.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsListComponent {}
