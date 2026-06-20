import {AsyncPipe, Location} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    inject,
    signal
} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {
    TuiButton,
    TuiDataList,
    TuiDialogService,
    TuiDropdown,
    TuiInput,
    TuiNotificationService,
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
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {HeaderHelpDialogComponent} from './header-help-dialog/header-help-dialog.component';

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
export class HeaderComponent implements OnInit {
    private readonly usersService = inject(UsersService);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly location = inject(Location);
    private readonly alerts = inject(TuiNotificationService);
    private readonly dialogs = inject(TuiDialogService);

    protected readonly profile$ = this.usersService.profile$;
    protected readonly open = signal(false);

    protected readonly skeleton = false;

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

    ngOnInit(): void {
        this.usersService.reloadProfile();
    }

    protected toggleUserMenu(event: MouseEvent): void {
        event.stopPropagation();

        this.open.update(open => !open);
    }

    protected onUserMenuAction(action: UserMenuAction): void {
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

    protected logout(): void {
        this.authService.logout().subscribe(() => {
            this.usersService.clearProfile();
            void this.router.navigate(['/auth/login']);
        });
    }

    protected goBack(): void {
        this.location.back();
    }

    protected openHelpDialog() {
        this.dialogs
            .open<string>(
                new PolymorpheusComponent(HeaderHelpDialogComponent),
                {
                    label: 'Помощь',
                    size: 's'
                }
            )

            .subscribe();
    }
}
