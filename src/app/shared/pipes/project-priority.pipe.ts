import {Pipe, PipeTransform} from '@angular/core';
import {ProjectPriority} from '../interfaces/project.enums';

@Pipe({
    name: 'projectPriority'
})
export class ProjectPriorityPipe implements PipeTransform {
    transform(priority: string | null | undefined): string {
        if (!priority) {
            return 'Без приоритета';
        }
        switch (priority) {
            case ProjectPriority.CRITICAL:
                return 'Критический';
            case ProjectPriority.HIGH:
                return 'Высокий';
            case ProjectPriority.MEDIUM:
                return 'Средний';
            case ProjectPriority.LOW:
                return 'Низкий';

            default:
                return priority;
        }
    }
}
