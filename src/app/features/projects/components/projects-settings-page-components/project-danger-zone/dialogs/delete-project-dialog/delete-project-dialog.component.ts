import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'app-delete-project-dialog',
    imports: [],
    templateUrl: './delete-project-dialog.component.html',
    styleUrl: './delete-project-dialog.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteProjectDialogComponent {}
