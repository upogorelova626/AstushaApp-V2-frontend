import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    OnInit,
    signal
} from '@angular/core';
import {TuiAvatar} from '@taiga-ui/kit';
import {ProjectsService} from '../../../services/projects.service';
import {ProjectMember} from '../../../interfaces/project-member.interface';
import {ProjectRole} from '../../../interfaces/project.enums';

@Component({
    selector: 'app-project-members-stats',
    imports: [TuiAvatar],
    templateUrl: './project-members-stats.component.html',
    styleUrl: './project-members-stats.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectMembersStatsComponent implements OnInit {
    private readonly projectsService = inject(ProjectsService);

    readonly projectId = input.required<string>();

    private readonly projectMembers = signal<ProjectMember[]>([]);
    protected readonly isLoading = signal(false);

    protected readonly projectManagersCount = computed(() => {
        return this.projectMembers().filter(member => {
            return (
                member.role === ProjectRole.OWNER ||
                member.role === ProjectRole.ADMIN
            );
        }).length;
    });

    protected readonly projectMembersCount = computed(() => {
        return this.projectMembers().length;
    });

    ngOnInit() {
        const projectId = this.projectId();

        if (!projectId) {
            return;
        }
        this.isLoading.set(true);
        this.projectsService
            .getProjectMembers(projectId)
            .subscribe(projectMembers => {
                this.projectMembers.set(projectMembers);
                this.isLoading.set(false);
            });
    }
}
