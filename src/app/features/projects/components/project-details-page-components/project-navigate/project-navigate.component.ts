import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-project-navigate',
    imports: [TuiButton, RouterLink],
    templateUrl: './project-navigate.component.html',
    styleUrl: './project-navigate.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectNavigateComponent {}
