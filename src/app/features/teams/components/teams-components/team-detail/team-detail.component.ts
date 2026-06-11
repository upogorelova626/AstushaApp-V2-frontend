import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    input,
    signal
} from '@angular/core';
import {Router} from '@angular/router';
import {
    TuiButton,
    TuiHint,
    TuiHintDirective,
    TuiIcon,
    TuiInput,
    TuiTextfield
} from '@taiga-ui/core';
import {TuiAvatar, TuiSkeleton} from '@taiga-ui/kit';
import {finalize, forkJoin} from 'rxjs';

import {TeamRoleLabelPipe} from '../../../../../shared/pipes/team-role-label.pipe';
import {Team} from '../../../interfaces/team.interface';
import {TeamMember, TeamRole} from '../../../interfaces/team-members.interface';
import {TeamMembersService} from '../../../services/team-members.service';
import {TeamsService} from '../../../services/teams.service';

@Component({
    selector: 'app-team-detail',
    imports: [
        TuiTextfield,
        TuiInput,
        TuiButton,
        TuiHintDirective,
        TuiHint,
        TuiIcon,
        TuiAvatar,
        TuiSkeleton,
        TeamRoleLabelPipe
    ],
    templateUrl: './team-detail.component.html',
    styleUrl: './team-detail.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamDetailComponent {
    readonly teamId = input<string | null>(null);

    private readonly teamsService = inject(TeamsService);
    private readonly teamMembersService = inject(TeamMembersService);
    private readonly router = inject(Router);

    protected readonly team = signal<Team | null>(null);
    protected readonly teamMembers = signal<TeamMember[]>([]);
    protected readonly isLoading = signal(false);

    protected readonly pageSize = 7;
    private readonly pageIndex = signal(0);

    protected readonly paginatedMembers = computed(() => {
        const start = this.pageIndex() * this.pageSize;

        return this.teamMembers().slice(start, start + this.pageSize);
    });

    protected readonly totalPages = computed(() => {
        const pages = Math.ceil(this.teamMembers().length / this.pageSize);

        return Math.max(pages, 1);
    });

    protected readonly currentPage = computed(() => this.pageIndex() + 1);

    protected readonly canGoPrev = computed(() => this.pageIndex() > 0);

    protected readonly canGoNext = computed(() => {
        return this.pageIndex() < this.totalPages() - 1;
    });

    protected readonly canManageTeam = computed(() => {
        const team = this.team();

        if (!team) {
            return false;
        }

        return team.myRole === TeamRole.Owner || team.myRole === TeamRole.Admin;
    });

    constructor() {
        effect(() => {
            const teamId = this.teamId();

            if (!teamId) {
                this.clearTeamData();

                return;
            }

            this.loadTeamData(teamId);
        });
    }

    protected goToPrevPage() {
        if (!this.canGoPrev()) {
            return;
        }

        this.pageIndex.update(page => page - 1);
    }

    protected goToNextPage() {
        if (!this.canGoNext()) {
            return;
        }

        this.pageIndex.update(page => page + 1);
    }

    protected openTeamSettings(team: Team) {
        if (!this.canManageTeam()) {
            return;
        }

        void this.router.navigate(['/dashboard', 'teams', team.id, 'settings']);
    }

    private loadTeamData(teamId: string) {
        this.isLoading.set(true);
        this.team.set(null);
        this.teamMembers.set([]);
        this.pageIndex.set(0);

        forkJoin({
            team: this.teamsService.getOneTeam(teamId),
            members: this.teamMembersService.getTeamMembers(teamId)
        })
            .pipe(
                finalize(() => {
                    this.isLoading.set(false);
                })
            )
            .subscribe(({team, members}) => {
                this.team.set(team);
                this.teamMembers.set(members);
                this.pageIndex.set(0);
            });
    }

    private clearTeamData() {
        this.team.set(null);
        this.teamMembers.set([]);
        this.pageIndex.set(0);
        this.isLoading.set(false);
    }
}
