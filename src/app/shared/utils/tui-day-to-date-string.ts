import {TuiDay} from '@taiga-ui/cdk';

export function tuiDayToDateString(date: TuiDay): string {
    const month = String(date.month + 1).padStart(2, '0');
    const day = String(date.day).padStart(2, '0');

    return `${date.year}-${month}-${day}`;
}
