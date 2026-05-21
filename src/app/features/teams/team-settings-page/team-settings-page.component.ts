import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal
} from '@angular/core';
import {TeamMainSettingsComponent} from '../components/team-main-settings/team-main-settings.component';
import {TeamInviteMemberComponent} from '../components/team-invite-member/team-invite-member.component';
import {TeamMembersSettingsComponent} from '../components/team-members-settings/team-members-settings.component';
import {TeamRolesSettingsComponent} from '../components/team-roles-settings/team-roles-settings.component';
import {TeamDangerZoneComponent} from '../components/team-danger-zone/team-danger-zone.component';
import {Team} from '../interfaces/team.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {TeamsService} from '../services/teams.service';

@Component({
    selector: 'app-team-settings-page',
    imports: [
        TeamMainSettingsComponent,
        TeamInviteMemberComponent,
        TeamMembersSettingsComponent,
        TeamRolesSettingsComponent,
        TeamDangerZoneComponent
    ],
    templateUrl: './team-settings-page.component.html',
    styleUrl: './team-settings-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamSettingsPageComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly teamsService = inject(TeamsService);

    protected readonly team = signal<Team | null>(null);
    protected readonly isLoading = signal(false);
    protected readonly teamId = signal<string | null>(null);

    ngOnInit() {
        this.loadTeam();
    }

    private loadTeam() {
        const teamId = this.route.snapshot.paramMap.get('teamId');

        if (!teamId) {
            void this.router.navigate(['/dashboard/teams']);

            return;
        }

        this.teamId.set(teamId);
        this.isLoading.set(true);

        this.teamsService.getOneTeam(teamId).subscribe({
            next: team => {
                this.team.set(team);
                this.isLoading.set(false);
            },
            error: error => {
                this.isLoading.set(false);
                void this.router.navigate(['/dashboard/teams']);
            }
        });
    }
}
