import {AbstractControl, ValidatorFn} from '@angular/forms';

export const changePasswordValidator = (): ValidatorFn => {
    return (control: AbstractControl) => {
        const currentPasswordControl = control.get('currentPassword');
        const newPasswordControl = control.get('newPassword');
        const confirmNewPasswordControl = control.get('confirmNewPassword');

        const currentPassword = currentPasswordControl?.value;
        const newPassword = newPasswordControl?.value;
        const confirmNewPassword = confirmNewPasswordControl?.value;

        if (newPasswordControl) {
            if (
                currentPassword &&
                newPassword &&
                currentPassword === newPassword
            ) {
                setControlError(newPasswordControl, 'samePassword');
            } else {
                removeControlError(newPasswordControl, 'samePassword');
            }
        }

        if (confirmNewPasswordControl) {
            if (
                newPassword &&
                confirmNewPassword &&
                newPassword !== confirmNewPassword
            ) {
                setControlError(
                    confirmNewPasswordControl,
                    'newPasswordMismatch'
                );
            } else {
                removeControlError(
                    confirmNewPasswordControl,
                    'newPasswordMismatch'
                );
            }
        }

        return null;
    };
};

function setControlError(control: AbstractControl, errorKey: string): void {
    control.setErrors({
        ...control.errors,
        [errorKey]: true
    });
}

function removeControlError(control: AbstractControl, errorKey: string): void {
    const errors = control.errors;

    if (!errors?.[errorKey]) {
        return;
    }

    const restErrors = {...errors};

    delete restErrors[errorKey];

    control.setErrors(Object.keys(restErrors).length ? restErrors : null);
}
