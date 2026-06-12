import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject
} from '@angular/core';
import {
    TuiButton,
    TuiDialogService,
    TuiError,
    TuiIcon,
    TuiInput,
    TuiNotificationService,
    TuiTextfield
} from '@taiga-ui/core';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {ReactiveFormsModule} from '@angular/forms';
import {ChangePassworsDialogComponent} from './change-passwors-dialog/change-passwors-dialog.component';
import {filter, switchMap, tap, timer} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';

@Component({
    selector: 'app-security-settings',
    imports: [
        TuiIcon,
        TuiButton,
        TuiInput,
        TuiError,
        TuiTextfield,
        ReactiveFormsModule
    ],
    templateUrl: './security-settings.component.html',
    styleUrl: './security-settings.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecuritySettingsComponent {
    private readonly alerts = inject(TuiNotificationService);
    private readonly dialogs = inject(TuiDialogService);
    private readonly destroyRef = inject(DestroyRef);
    router = inject(Router);

    protected openChangePasswordDialog() {
        this.dialogs
            .open<boolean>(
                new PolymorpheusComponent(ChangePassworsDialogComponent),
                {
                    label: 'Изменить пароль',
                    size: 's'
                }
            )
            .pipe(
                filter(Boolean),
                tap(() => {
                    this.alerts
                        .open('Пароль успешно изменён. Войдите заново')
                        .pipe(takeUntilDestroyed(this.destroyRef))
                        .subscribe();
                }),
                switchMap(() => timer(1500)),
                tap(() => {
                    this.router.navigate(['auth/login']);
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }
}
