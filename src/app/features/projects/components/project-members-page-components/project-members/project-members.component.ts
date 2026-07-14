import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    OnInit,
    signal
} from '@angular/core';
import {
    TuiButton,
    TuiHint,
    TuiIcon,
    TuiInput,
    TuiTextfield
} from '@taiga-ui/core';
import {TuiAvatar} from '@taiga-ui/kit';
import {finalize, forkJoin, startWith} from 'rxjs';
import {ProjectMember} from '../../../interfaces/project-member.interface';
import {ProjectsService} from '../../../services/projects.service';
import {TuiSkeleton} from '@taiga-ui/kit';
import {TeamRoleLabelPipe} from '../../../../../shared/pipes/team-role-label.pipe';
import {ProjectTasksService} from '../../../services/project-tasks.service';
import {ProjectTask} from '../../../interfaces/project-tasks.interface';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-project-members',
    imports: [
        TuiHint,
        TuiAvatar,
        TuiIcon,
        TuiTextfield,
        TuiButton,
        TuiInput,
        TuiSkeleton,
        TeamRoleLabelPipe,
        ReactiveFormsModule
    ],
    templateUrl: './project-members.component.html',
    styleUrl: './project-members.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectMembersComponent implements OnInit {
    readonly projectId = input.required<string>();

    private readonly projectsService = inject(ProjectsService);
    private readonly projectTasksService = inject(ProjectTasksService);

    protected readonly isLoading = signal(false);
    protected readonly projectMembers = signal<ProjectMember[]>([]);
    protected readonly tasks = signal<ProjectTask[]>([]);

    ngOnInit() {
        this.isLoading.set(true);

        forkJoin({
            projectMembers: this.projectsService.getProjectMembers(
                this.projectId()
            ),
            tasks: this.projectTasksService.getAllTasks(this.projectId())
        })
            .pipe(
                finalize(() => {
                    this.isLoading.set(false);
                })
            )
            .subscribe(({projectMembers, tasks}) => {
                this.projectMembers.set(projectMembers);
                this.tasks.set(tasks);
            });
    }

    protected taskCount(userId: string): number {
        return this.tasks().filter(task => task.assignee?.id === userId).length;
    }

    protected readonly search = new FormControl('', {nonNullable: true});

    private readonly searchQuery = toSignal(
        this.search.valueChanges.pipe(startWith(this.search.value)),
        {
            initialValue: ''
        }
    );

    protected members = computed(() => {
        const searchQuery = this.searchQuery().trim().toLowerCase();
        if (!searchQuery) {
            return this.projectMembers();
        }
        return this.projectMembers().filter(
            member =>
                member.user.firstName?.toLowerCase().includes(searchQuery) ||
                member.user.lastName?.toLowerCase().includes(searchQuery) ||
                member.user.email.toLowerCase().includes(searchQuery)
        );
    });
}
