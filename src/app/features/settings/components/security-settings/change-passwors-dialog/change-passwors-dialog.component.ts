import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {
    FormControl,
    FormGroup,
    Validators,
    ReactiveFormsModule,
    AbstractControl
} from '@angular/forms';
import {changePasswordValidator} from '../../../validators/change-password.validator';
import {UsersService} from '../../../../users/services/users.service';
import {
    TuiError,
    TuiLabel,
    TuiTextfield,
    TuiInput,
    TuiButton,
    TUI_VALIDATION_ERRORS,
    type TuiDialogContext,
    TuiIcon
} from '@taiga-ui/core';
import {VALIDATION_ERRORS} from '../../../../../shared/constants/validation-errors';
import {injectContext} from '@taiga-ui/polymorpheus';
import {TuiPassword} from '@taiga-ui/kit';
import {catchError, EMPTY} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
    selector: 'app-change-passwors-dialog',
    imports: [
        ReactiveFormsModule,
        TuiError,
        TuiLabel,
        TuiTextfield,
        TuiInput,
        TuiButton,
        TuiIcon,
        TuiPassword
    ],
    templateUrl: './change-passwors-dialog.component.html',
    styleUrl: './change-passwors-dialog.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: TUI_VALIDATION_ERRORS,
            useValue: VALIDATION_ERRORS
        }
    ]
})
export class ChangePassworsDialogComponent {
    protected readonly context =
        injectContext<TuiDialogContext<boolean, void>>();

    private readonly usersService = inject(UsersService);

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
            validators: [changePasswordValidator()]
        }
    );

    protected changePassword() {
        this.removeControlError(
            this.form.controls.currentPassword,
            'serverError'
        );

        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();

        if (this.form.invalid) {
            return;
        }

        const {currentPassword, newPassword} = this.form.getRawValue();

        this.usersService
            .changePassword({
                currentPassword,
                newPassword
            })
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    this.setControlError(
                        this.form.controls.currentPassword,
                        'serverError',
                        this.getErrorMessage(error)
                    );

                    this.form.controls.currentPassword.markAsTouched();

                    return EMPTY;
                })
            )
            .subscribe(() => {
                this.context.completeWith(true);
            });
    }

    protected closeChangePasswordDialog() {
        this.context.$implicit.complete();
    }

    private getErrorMessage(error: HttpErrorResponse): string {
        const message = error.error?.message;

        if (Array.isArray(message)) {
            return message[0] ?? 'Не удалось изменить пароль';
        }

        return message || 'Не удалось изменить пароль';
    }

    private setControlError(
        control: AbstractControl,
        errorKey: string,
        errorValue: unknown
    ) {
        control.setErrors({
            ...control.errors,
            [errorKey]: errorValue
        });
    }

    private removeControlError(control: AbstractControl, errorKey: string) {
        const errors = control.errors;

        if (!errors?.[errorKey]) {
            return;
        }

        const {[errorKey]: _, ...restErrors} = errors;

        control.setErrors(Object.keys(restErrors).length ? restErrors : null);
    }
}
