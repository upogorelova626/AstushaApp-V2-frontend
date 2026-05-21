import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'pluralizeRu',
    standalone: true
})
export class PluralizeRuPipe implements PipeTransform {
    transform(count: number, one: string, few: string, many: string): string {
        const absoluteCount = Math.abs(count);
        const lastTwoDigits = absoluteCount % 100;
        const lastDigit = absoluteCount % 10;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
            return `${count} ${many}`;
        }

        if (lastDigit === 1) {
            return `${count} ${one}`;
        }

        if (lastDigit >= 2 && lastDigit <= 4) {
            return `${count} ${few}`;
        }

        return `${count} ${many}`;
    }
}
