import {HttpErrorResponse} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {
    TUI_VALIDATION_ERRORS,
    TuiButton,
    TuiError,
    TuiIcon,
    TuiInput,
    TuiTextfield
} from '@taiga-ui/core';
import {TuiPassword} from '@taiga-ui/kit';
import {catchError, EMPTY} from 'rxjs';

import {VALIDATION_ERRORS} from '../../../../shared/constants/validation-errors';
import {UsersService} from '../../../users/services/users.service';
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'app-login-page',
    imports: [
        TuiTextfield,
        TuiButton,
        TuiInput,
        TuiIcon,
        TuiError,
        TuiPassword,
        ReactiveFormsModule
    ],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: TUI_VALIDATION_ERRORS,
            useValue: VALIDATION_ERRORS
        }
    ]
})
export class LoginPageComponent {
    private readonly authService = inject(AuthService);
    private readonly usersService = inject(UsersService);
    private readonly router = inject(Router);

    protected readonly form = new FormGroup({
        email: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.email,
                Validators.maxLength(255)
            ]
        }),
        password: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(72)
            ]
        }),
        rememberMe: new FormControl(false, {
            nonNullable: true
        })
    });

    protected login(): void {
        this.clearServerError();

        if (this.form.invalid) {
            this.form.markAllAsTouched();

            return;
        }

        const {email, password} = this.form.getRawValue();

        this.authService
            .login({email, password})
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    this.form.setErrors({
                        ...this.form.errors,
                        serverError: this.getErrorMessage(error)
                    });

                    this.form.markAllAsTouched();

                    return EMPTY;
                })
            )
            .subscribe(() => {
                this.usersService.reloadProfile();
                this.router.navigate(['/dashboard']);
            });
    }

    private clearServerError(): void {
        const errors = this.form.errors;

        if (!errors?.['serverError']) {
            return;
        }

        const {serverError, ...restErrors} = errors;

        this.form.setErrors(Object.keys(restErrors).length ? restErrors : null);
    }

    private getErrorMessage(error: HttpErrorResponse): string {
        const message = error.error?.message;

        if (Array.isArray(message)) {
            return message[0] ?? 'Не удалось авторизоваться';
        }

        return message || 'Не удалось авторизоваться';
    }
}
