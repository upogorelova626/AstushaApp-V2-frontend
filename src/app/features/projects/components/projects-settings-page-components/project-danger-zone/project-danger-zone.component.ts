import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiButton, TuiDialog, TuiIcon} from '@taiga-ui/core';

@Component({
    selector: 'app-project-danger-zone',
    imports: [TuiButton, TuiDialog, TuiIcon],
    templateUrl: './project-danger-zone.component.html',
    styleUrl: './project-danger-zone.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDangerZoneComponent {
    protected isDeleteProjectDialogOpen = false;

    protected openDeleteProjectDialog(): void {
        this.isDeleteProjectDialogOpen = true;
    }

    protected closeDeleteProjectDialog(): void {
        this.isDeleteProjectDialogOpen = false;
    }

    protected deleteProject(): void {
        // потом сюда подключим удаление проекта
    }
}
