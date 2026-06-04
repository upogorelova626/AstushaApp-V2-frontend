import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TuiButton, TuiIcon, TuiInput, TuiTextfield} from '@taiga-ui/core';
import {TuiSwitch} from '@taiga-ui/kit';

import {Project} from '../../../projects/interfaces/project.interface';

@Component({
    selector: 'app-boards-toolbar',
    imports: [
        RouterLink,
        TuiIcon,
        TuiButton,
        TuiTextfield,
        TuiInput,
        TuiSwitch
    ],
    templateUrl: './boards-toolbar.component.html',
    styleUrl: './boards-toolbar.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardsToolbarComponent {
    readonly projects = input<Project[]>([]);
    readonly selectedProjectId = input<string | null>(null);
    readonly isLoading = input(false);
    readonly onlyMine = input(false);

    readonly projectSelected = output<string | null>();
    readonly onlyMineChanged = output<boolean>();

    protected selectProject(event: Event): void {
        const projectId = (event.target as HTMLSelectElement).value;

        this.projectSelected.emit(projectId || null);
    }

    protected onOnlyMineChange(event: Event): void {
        const checked = (event.target as HTMLInputElement).checked;

        this.onlyMineChanged.emit(checked);
    }
}
