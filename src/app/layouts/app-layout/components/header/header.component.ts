import {AsyncPipe} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal
} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {
    TuiButton,
    TuiDataList,
    TuiDropdown,
    TuiInput,
    TuiOption,
    TuiTextfield
} from '@taiga-ui/core';
import {TuiAvatar, TuiBreadcrumbs, TuiSkeleton} from '@taiga-ui/kit';

import {
    UserMenuAction,
    UserMenuActionOption
} from '../../../../features/teams/interfaces/dropdowns.interface';
import {UsersService} from '../../../../features/users/services/users.service';
import {AuthService} from '../../../../features/auth/services/auth.service';
import {BreadcrumbsComponent} from '../breadcrumbs/breadcrumbs.component';
import {Location} from '@angular/common';

@Component({
    selector: 'app-header',
    imports: [
        AsyncPipe,
        ReactiveFormsModule,
        TuiAvatar,
        TuiBreadcrumbs,
        TuiButton,
        TuiInput,
        TuiTextfield,
        TuiDataList,
        TuiDropdown,
        TuiOption,
        TuiSkeleton,
        BreadcrumbsComponent
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
    private readonly usersService = inject(UsersService);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly location = inject(Location);

    protected readonly profile$ = this.usersService.profile$;
    protected readonly open = signal(false);

    protected skeleton = false;

    protected readonly userMenuActions: readonly UserMenuActionOption[] = [
        {
            title: 'Настройки',
            value: UserMenuAction.OpenSettings
        },
        {
            title: 'Выйти',
            value: UserMenuAction.Logout
        }
    ];

    protected toggleUserMenu(event: MouseEvent) {
        event.stopPropagation();

        this.open.update(open => !open);
    }

    protected onUserMenuAction(action: UserMenuAction) {
        this.open.set(false);

        switch (action) {
            case UserMenuAction.OpenSettings:
                void this.router.navigate(['/dashboard/settings']);
                return;

            case UserMenuAction.Logout:
                this.logout();
                return;
        }
    }

    protected logout() {
        this.authService.logout().subscribe(() => {
            this.usersService.clearProfile();
            this.router.navigate(['/auth/login']);
        });
    }

    protected goBack() {
        this.location.back();
    }
}
