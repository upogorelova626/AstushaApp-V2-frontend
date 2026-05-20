import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal
} from '@angular/core';
import {TuiTextfield, TuiButton, TuiInput, TuiIcon} from '@taiga-ui/core';
import {AuthService} from '../../services/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {TuiPassword} from '@taiga-ui/kit';

@Component({
    selector: 'app-login-page',
    imports: [
        TuiTextfield,
        TuiButton,
        TuiInput,
        TuiIcon,
        ReactiveFormsModule,
        TuiPassword
    ],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    protected readonly errorMessage = signal<string | null>(null);

    form = new FormGroup({
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

    login(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.errorMessage.set(null);

        const {email, password} = this.form.getRawValue();

        const payload = {email, password};

        this.authService.login(payload).subscribe({
            next: () => {
                this.router.navigate(['/dashboard']);
            },
            error: () => {
                this.errorMessage.set('Неверный email или пароль');
            }
        });
    }
}
