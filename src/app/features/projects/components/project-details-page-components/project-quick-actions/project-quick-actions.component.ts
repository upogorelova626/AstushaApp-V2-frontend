import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';
import {TuiButton, TuiIcon} from '@taiga-ui/core';
import {Project} from '../../../../../shared/interfaces/project.interface';
import {AstushaIdAuthService} from '../../../../../shared/services/astusha-id-auth.service';

@Component({
    selector: 'app-project-quick-actions',
    imports: [TuiButton, TuiIcon, RouterLink],
    templateUrl: './project-quick-actions.component.html',
    styleUrl: './project-quick-actions.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectQuickActionsComponent {
    private readonly astushaIdAuthService = inject(AstushaIdAuthService);

    readonly project = input<Project | null>(null);
    readonly canManageProject = input(false);

    private readonly me = toSignal(this.astushaIdAuthService.getMe(), {
        initialValue: null
    });
}
