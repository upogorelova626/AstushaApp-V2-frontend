import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    output,
    signal
} from '@angular/core';
import {TuiIcon, TuiButton, TuiTextfield, TuiInput} from '@taiga-ui/core';
import {Project} from '../../../projects/interfaces/project.interface';
import {TuiDataListWrapperComponent} from '@taiga-ui/kit';
import {ProjectTasksService} from '../../../projects/services/project-tasks.service';

@Component({
    selector: 'app-boards-toolbar',
    imports: [
        TuiIcon,
        TuiButton,
        TuiTextfield,
        TuiInput,
        TuiDataListWrapperComponent
    ],
    templateUrl: './boards-toolbar.component.html',
    styleUrl: './boards-toolbar.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardsToolbarComponent {
    readonly projects = input<Project[]>([]);
    readonly selectedProjectId = input<string | null>(null);
    readonly isLoading = input(false);

    readonly projectSelected = output<string | null>();

    protected selectProject(event: Event) {
        const projectId = (event.target as HTMLSelectElement).value;

        this.projectSelected.emit(projectId || null);
    }
}
