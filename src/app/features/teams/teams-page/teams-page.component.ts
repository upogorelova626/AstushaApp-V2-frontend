import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TeamsListComponent} from '../components/teams-list/teams-list.component';
import {TeamDetailComponent} from '../components/team-detail/team-detail.component';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-teams-page',
    imports: [TeamsListComponent, TeamDetailComponent],
    templateUrl: './teams-page.component.html',
    styleUrl: './teams-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamsPageComponent {}
