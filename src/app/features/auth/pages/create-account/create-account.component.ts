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
    TuiDialogService,
    TuiError,
    TuiIcon,
    TuiInput,
    TuiTextfieldComponent
} from '@taiga-ui/core';
import {TuiPassword} from '@taiga-ui/kit';
import {AuthService} from '../../services/auth.service';
import {passwordMatchValidator} from '../../validators/password-match.validator';
import {VALIDATION_ERRORS} from '../../../../shared/constants/validation-errors';

@Component({
    selector: 'app-create-account',
    imports: [
        TuiTextfieldComponent,
        TuiIcon,
        TuiButton,
        TuiInput,
        ReactiveFormsModule,
        RouterLink,
        TuiPassword,
        TuiError
    ],
    templateUrl: './create-account.component.html',
    styleUrl: './create-account.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: TUI_VALIDATION_ERRORS,
            useValue: VALIDATION_ERRORS
        }
    ]
})
export class CreateAccountComponent {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly dialogs = inject(TuiDialogService);

    form = new FormGroup(
        {
            login: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(30)
                ]
            }),
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
            confirmPassword: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(72)
                ]
            }),
            agreement: new FormControl(false, {
                nonNullable: true,
                validators: [Validators.requiredTrue]
            })
        },
        {
            validators: passwordMatchValidator
        }
    );

    createAccount() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();

            return;
        }

        const {login, email, password} = this.form.getRawValue();

        const payload = {
            login,
            email,
            password
        };

        this.authService.createAccount(payload).subscribe({
            next: () => {
                this.router.navigate(['/dashboard']);
            },
            error: error => {
                this.dialogs
                    .open(this.getErrorMessage(error), {
                        label: 'Ошибка создания аккаунта',
                        size: 's'
                    })
                    .subscribe();
            }
        });
    }

    private getErrorMessage(error: unknown): string {
        if (error instanceof HttpErrorResponse) {
            const message = error.error?.message;

            if (Array.isArray(message)) {
                return message[0] ?? 'Не удалось создать аккаунт';
            }

            if (typeof message === 'string') {
                return message;
            }
        }

        return 'Не удалось создать аккаунт. Попробуйте позже';
    }
}
