import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function notBlankValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        if (typeof value !== 'string') {
            return null;
        }

        return value.trim().length > 0 ? null : {notBlank: true};
    };
}

export function noSpacesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        if (typeof value !== 'string') {
            return null;
        }

        return /\s/.test(value) ? {spacesNotAllowed: true} : null;
    };
}
