import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal
} from '@angular/core';
import {TuiIcon, TuiButton, TuiHintDirective} from '@taiga-ui/core';
import {UsersService} from '../../../users/services/users.service';
import {Theme} from '../../../auth/models/interfaces/auth.interface';
import {finalize} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-theme-settings',
    imports: [TuiIcon, TuiButton, TuiHintDirective],
    templateUrl: './theme-settings.component.html',
    styleUrl: './theme-settings.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeSettingsComponent {
    protected readonly Theme = Theme;

    private readonly usersService = inject(UsersService);

    protected readonly isLoading = signal(false);

    protected readonly profile = toSignal(this.usersService.profile$, {
        initialValue: null
    });

    protected changeTheme(theme: Theme): void {
        if (this.isLoading() || this.profile()?.theme === theme) {
            return;
        }

        this.isLoading.set(true);

        this.usersService
            .changeTheme({theme})
            .pipe(
                finalize(() => {
                    this.isLoading.set(false);
                })
            )
            .subscribe();
    }
}
