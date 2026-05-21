import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ProjectsStatsComponent} from '../../components/projects-stats/projects-stats.component';
import {ProjectsSearchingComponent} from '../../components/projects-searching/projects-searching.component';
import {ProjectsListComponent} from '../../components/projects-list/projects-list.component';

@Component({
    selector: 'app-projects-page',
    imports: [
        ProjectsStatsComponent,
        ProjectsSearchingComponent,
        ProjectsListComponent
    ],
    templateUrl: './projects-page.component.html',
    styleUrl: './projects-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsPageComponent {}
