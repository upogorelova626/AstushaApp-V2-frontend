import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export const differentPasswordValidator = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const currentPassword = control.get('currentPassword')?.value;
        const newPassword = control.get('newPassword')?.value;

        if (!currentPassword || !newPassword) {
            return null;
        }

        return currentPassword === newPassword ? {samePassword: true} : null;
    };
};

export const newPasswordMatchValidator = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const newPassword = control.get('newPassword')?.value;
        const confirmNewPassword = control.get('confirmNewPassword')?.value;

        if (!newPassword || !confirmNewPassword) {
            return null;
        }

        return newPassword !== confirmNewPassword
            ? {newPasswordMismatch: true}
            : null;
    };
};
