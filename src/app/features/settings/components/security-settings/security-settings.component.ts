import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal
} from '@angular/core';
import {
    TuiButton,
    TuiDialog,
    TuiIcon,
    TuiInput,
    TuiTextfield,
    TuiError
} from '@taiga-ui/core';
import {Router} from '@angular/router';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

import {UsersService} from '../../../users/services/users.service';
import {
    differentPasswordValidator,
    newPasswordMatchValidator
} from '../../validators/change-password.validator';

@Component({
    selector: 'app-security-settings',
    imports: [
        TuiIcon,
        TuiButton,
        TuiInput,
        TuiError,
        TuiDialog,
        TuiTextfield,
        ReactiveFormsModule
    ],
    templateUrl: './security-settings.component.html',
    styleUrl: './security-settings.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecuritySettingsComponent {
    protected readonly usersService = inject(UsersService);
    private readonly router = inject(Router);

    protected readonly isChangeDialogOpen = signal(false);

    protected readonly form = new FormGroup(
        {
            currentPassword: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(72)
                ]
            }),
            newPassword: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(72)
                ]
            }),
            confirmNewPassword: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(72)
                ]
            })
        },
        {
            validators: [
                differentPasswordValidator(),
                newPasswordMatchValidator()
            ]
        }
    );

    protected openChangePasswordDialog(): void {
        this.isChangeDialogOpen.set(true);
    }

    protected closeChangePasswordDialog(): void {
        this.isChangeDialogOpen.set(false);
        this.form.reset();
    }

    protected changePassword(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();

            return;
        }

        const {currentPassword, newPassword} = this.form.getRawValue();

        this.usersService
            .changePassword({
                currentPassword,
                newPassword
            })
            .subscribe(() => {
                this.closeChangePasswordDialog();
                this.router.navigate(['/login']);
            });
    }
}
