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
    readonly canManageProject = input(false);

    private readonly me = toSignal(this.authService.me(), {
        initialValue: null
    });
}
