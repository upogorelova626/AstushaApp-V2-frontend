import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
): ValidationErrors | null => {
    const passwordControl = control.get('password');
    const confirmPasswordControl = control.get('confirmPassword');

    if (!passwordControl || !confirmPasswordControl) {
        return null;
    }

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    const confirmPasswordErrors = {
        ...(confirmPasswordControl.errors ?? {})
    };

    if (!password || !confirmPassword || password === confirmPassword) {
        delete confirmPasswordErrors['passwordMismatch'];

        confirmPasswordControl.setErrors(
            Object.keys(confirmPasswordErrors).length
                ? confirmPasswordErrors
                : null
        );

        return null;
    }

    confirmPasswordControl.setErrors({
        ...confirmPasswordErrors,
        passwordMismatch: true
    });

    return null;
};
