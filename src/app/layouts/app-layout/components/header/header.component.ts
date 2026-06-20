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
    TuiHint,
    TuiInput,
    TuiOption,
    TuiTextfield
} from '@taiga-ui/core';
import {TuiAvatar, TuiBreadcrumbs, TuiSkeleton} from '@taiga-ui/kit';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {AuthService} from '../../../../features/auth/services/auth.service';
import {
    CreateMenuAction,
    CreateMenuActionOption,
    UserMenuAction,
    UserMenuActionOption
} from '../../../../features/teams/interfaces/dropdowns.interface';
import {UsersService} from '../../../../features/users/services/users.service';
import {BreadcrumbsComponent} from '../breadcrumbs/breadcrumbs.component';
import {HeaderHelpDialogComponent} from './header-help-dialog/header-help-dialog.component';

@Component({
    selector: 'app-header',
    imports: [
        AsyncPipe,
        ReactiveFormsModule,
        TuiAvatar,
        TuiBreadcrumbs,
        TuiButton,
        TuiDataList,
        TuiDropdown,
        TuiInput,
        TuiOption,
        TuiSkeleton,
        TuiTextfield,
        BreadcrumbsComponent,
        TuiHint
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
    private readonly dialogs = inject(TuiDialogService);

    protected readonly profile$ = this.usersService.profile$;

    protected readonly openActionsMenu = signal(false);
    protected readonly openCreateMenu = signal(false);
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

    protected readonly createMenuActions: readonly CreateMenuActionOption[] = [
        {
            title: 'Команда',
            value: CreateMenuAction.CreateTeam
        },
        {
            title: 'Проект',
            value: CreateMenuAction.CreateProject
        }
    ];

    ngOnInit() {
        this.usersService.reloadProfile();
    }

    protected toggleUserMenu(event: MouseEvent) {
        event.stopPropagation();
        this.openCreateMenu.set(false);
        this.openActionsMenu.update(open => !open);
    }

    protected onUserMenuAction(action: UserMenuAction) {
        this.openActionsMenu.set(false);

        switch (action) {
            case UserMenuAction.OpenSettings:
                void this.router.navigate(['/dashboard/settings']);
                return;

            case UserMenuAction.Logout:
                this.logout();
                return;
        }
    }

    protected toggleCreateMenu(event: MouseEvent) {
        event.stopPropagation();
        this.openActionsMenu.set(false);
        this.openCreateMenu.update(open => !open);
    }

    protected onCreateMenuAction(action: CreateMenuAction) {
        this.openCreateMenu.set(false);

        switch (action) {
            case CreateMenuAction.CreateTeam:
                void this.router.navigate(['dashboard/teams']);
                return;

            case CreateMenuAction.CreateProject:
                void this.router.navigate(['dashboard/projects']);
                return;
        }
    }

    protected openHelpDialog() {
        this.dialogs
            .open<void>(new PolymorpheusComponent(HeaderHelpDialogComponent), {
                label: 'Помощь',
                size: 's'
            })
            .subscribe();
    }

    protected goBack() {
        this.location.back();
    }

    private logout() {
        this.authService.logout().subscribe(() => {
            this.usersService.clearProfile();
            void this.router.navigate(['/auth/login']);
        });
    }
}
