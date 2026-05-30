import {
    ChangeDetectionStrategy,
    Component,
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
import {finalize} from 'rxjs';
import {ProjectMember} from '../../../interfaces/project-member.interface';
import {ProjectsService} from '../../../services/projects.service';
import {TuiSkeleton} from '@taiga-ui/kit';

@Component({
    selector: 'app-project-members',
    imports: [
        TuiHint,
        TuiAvatar,
        TuiIcon,
        TuiTextfield,
        TuiButton,
        TuiInput,
        TuiSkeleton
    ],
    templateUrl: './project-members.component.html',
    styleUrl: './project-members.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectMembersComponent implements OnInit {
    readonly projectId = input.required<string>();

    private readonly projectsService = inject(ProjectsService);

    protected readonly isLoading = signal(false);
    protected readonly projectMembers = signal<ProjectMember[]>([]);

    ngOnInit() {
        this.loadProjectMembers();
    }

    private loadProjectMembers() {
        this.isLoading.set(true);

        this.projectsService
            .getProjectMembers(this.projectId())
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe(projectMembers => {
                this.projectMembers.set(projectMembers);
            });
    }
}
