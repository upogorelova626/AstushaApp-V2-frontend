import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input
} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';
import {TuiButton, TuiIcon} from '@taiga-ui/core';

import {AuthService} from '../../../../auth/services/auth.service';
import {Project} from '../../../interfaces/project.interface';

@Component({
    selector: 'app-project-quick-actions',
    imports: [TuiButton, TuiIcon, RouterLink],
    templateUrl: './project-quick-actions.component.html',
    styleUrl: './project-quick-actions.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectQuickActionsComponent {
    private readonly authService = inject(AuthService);

    readonly project = input<Project | null>(null);

    private readonly me = toSignal(this.authService.me(), {
        initialValue: null
    });

    protected readonly canManageProject = computed(() => {
        const project = this.project();
        const me = this.me();

        if (!project || !me) {
            return false;
        }

        const currentProjectMember = project.members.find(
            member => member.userId === me.id
        );

        return (
            currentProjectMember?.role === 'OWNER' ||
            currentProjectMember?.role === 'ADMIN'
        );
    });
}
