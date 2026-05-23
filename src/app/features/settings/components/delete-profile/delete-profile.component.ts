import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal
} from '@angular/core';
import {
    TuiIcon,
    TuiButton,
    TuiDialog,
    TuiTitle,
    TUI_DIALOGS_CLOSE
} from '@taiga-ui/core';
import {Router} from '@angular/router';
import {merge} from 'rxjs';
import {UsersService} from '../../../users/services/users.service';

@Component({
    selector: 'app-delete-profile',
    imports: [TuiIcon, TuiButton, TuiTitle, TuiDialog],
    templateUrl: './delete-profile.component.html',
    styleUrl: './delete-profile.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: TUI_DIALOGS_CLOSE,
            useFactory: () => merge(inject(Router).events)
        }
    ]
})
export class DeleteProfileComponent {
    protected readonly usersService = inject(UsersService);
    protected readonly isDeleteDialogOpen = signal(false);
    private readonly router = inject(Router);

    protected openDeleteDialog() {
        this.isDeleteDialogOpen.set(true);
    }

    protected closeDeleteDialog() {
        this.isDeleteDialogOpen.set(false);
    }

    deleteProfile() {
        this.usersService.deleteMyProfile().subscribe({
            next: () => {
                this.closeDeleteDialog();
                this.router.navigate(['/login']);
            }
        });
    }
}
