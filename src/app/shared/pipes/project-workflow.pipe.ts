import {Pipe, PipeTransform} from '@angular/core';
import {ProjectWorkflowType} from '../../features/projects/interfaces/projects.interface';

@Pipe({
    name: 'projectWorkflowType'
})
export class ProjectWorkflowPipe implements PipeTransform {
    transform(type: string | null | undefined): string {
        if (!type) {
            return 'Без типа';
        }
        switch (type) {
            case ProjectWorkflowType.DEVELOPMENT:
                return 'Разработка';
            case ProjectWorkflowType.DESIGN:
                return 'Дизайн';
            case ProjectWorkflowType.SIMPLE:
                return 'Простой процесс';
            case ProjectWorkflowType.CUSTOM:
                return 'Свой процесс';
            default:
                return type;
        }
    }
}
