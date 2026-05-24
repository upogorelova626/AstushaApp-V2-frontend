import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {TuiDay} from '@taiga-ui/cdk';

export const notPastDateValidator: ValidatorFn = (
    control: AbstractControl
): ValidationErrors | null => {
    const date = control.value as TuiDay | null;

    if (!date) {
        return null;
    }

    const today = TuiDay.currentLocal();

    const selectedDate = new Date(date.year, date.month, date.day).getTime();
    const todayDate = new Date(today.year, today.month, today.day).getTime();

    return selectedDate < todayDate ? {pastDate: true} : null;
};

export const deadlineAfterStartDateValidator: ValidatorFn = (
    control: AbstractControl
): ValidationErrors | null => {
    const startDate = control.get('startDate')?.value as TuiDay | null;
    const deadlineDate = control.get('deadline')?.value as TuiDay | null;

    if (!startDate || !deadlineDate) {
        return null;
    }

    const start = new Date(
        startDate.year,
        startDate.month,
        startDate.day
    ).getTime();

    const deadline = new Date(
        deadlineDate.year,
        deadlineDate.month,
        deadlineDate.day
    ).getTime();

    return deadline < start ? {deadlineBeforeStartDate: true} : null;
};
