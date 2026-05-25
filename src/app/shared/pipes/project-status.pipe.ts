import {Pipe, PipeTransform} from '@angular/core';
import {ProjectStatus} from '../../features/projects/interfaces/projects.interface';

@Pipe({
    name: 'projectStatus'
})
export class ProjectStatusPipe implements PipeTransform {
    transform(status: string | null | undefined): string {
        if (!status) {
            return 'Без роли';
        }
        switch (status) {
            case ProjectStatus.ACTIVE:
                return 'В работе';
            case ProjectStatus.ARCHIVED:
                return 'В архиве';
            case ProjectStatus.COMPLETED:
                return 'Завершён';
            case ProjectStatus.PAUSED:
                return 'На паузе';

            default:
                return status;
        }
    }
}
