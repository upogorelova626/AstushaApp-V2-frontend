import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    OnInit,
    signal
} from '@angular/core';
import {TuiAvatar, TuiSkeleton} from '@taiga-ui/kit';
import {finalize, forkJoin, map} from 'rxjs';

import {ProjectMember} from '../../../interfaces/project-member.interface';
import {ProjectRole} from '../../../interfaces/project.enums';
import {ProjectsService} from '../../../services/projects.service';
import {ProjectTasksService} from '../../../services/project-tasks.service';

@Component({
    selector: 'app-project-members-stats',
    imports: [TuiAvatar, TuiSkeleton],
    templateUrl: './project-members-stats.component.html',
    styleUrl: './project-members-stats.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectMembersStatsComponent implements OnInit {
    private readonly projectsService = inject(ProjectsService);
    private readonly projectTasksService = inject(ProjectTasksService);

    readonly projectId = input.required<string>();

    protected readonly isLoading = signal(false);
    protected readonly tasksSum = signal(0);

    private readonly projectMembers = signal<ProjectMember[]>([]);

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

        forkJoin({
            projectMembers: this.projectsService.getProjectMembers(projectId),
            tasksSum: this.projectTasksService
                .getAllTasks(projectId)
                .pipe(map(tasks => tasks.length))
        })
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe(({projectMembers, tasksSum}) => {
                this.projectMembers.set(projectMembers);
                this.tasksSum.set(tasksSum);
            });
    }
}
