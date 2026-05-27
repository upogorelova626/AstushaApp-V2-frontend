import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {TuiTabs, TuiTab, TuiTabsHorizontal} from '@taiga-ui/kit';

@Component({
    selector: 'app-project-navigate',
    imports: [RouterLink, RouterLinkActive, TuiTabs, TuiTab, TuiTabsHorizontal],
    templateUrl: './project-navigate.component.html',
    styleUrl: './project-navigate.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectNavigateComponent {
    readonly projectId = input.required<string>();
}
