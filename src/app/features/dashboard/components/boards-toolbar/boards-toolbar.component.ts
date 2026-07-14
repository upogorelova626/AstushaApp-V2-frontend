import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TuiButton, TuiIcon, TuiInput, TuiTextfield} from '@taiga-ui/core';
import {TuiSwitch} from '@taiga-ui/kit';
import {Project} from '../../../../shared/interfaces/project.interface';
import {ProjectMember} from '../../../../shared/interfaces/interfaces/project-member.interface';
import {TaskPriority} from '../../../../shared/interfaces/project-tasks.interface';
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
    readonly selectedProjectMembers = input<ProjectMember[]>([]);

    readonly selectedProjectId = input<string | null>(null);
    readonly selectedAssigneeId = input<string | null>(null);

    readonly selectedPriority = input<TaskPriority | null>(null);

    readonly isLoading = input(false);
    readonly onlyMine = input(false);

    readonly projectSelected = output<string | null>();
    readonly assigneeSelected = output<string | null>();
    readonly onlyMineChanged = output<boolean>();

    readonly prioritySelected = output<TaskPriority | null>();

    protected selectProject(event: Event) {
        const projectId = (event.target as HTMLSelectElement).value;

        this.projectSelected.emit(projectId || null);
    }

    protected selectAssignee(event: Event) {
        const assigneeId = (event.target as HTMLSelectElement).value;

        this.assigneeSelected.emit(assigneeId || null);
    }

    protected onOnlyMineChange(event: Event) {
        const checked = (event.target as HTMLInputElement).checked;

        this.onlyMineChanged.emit(checked);
    }

    protected selectPriority(event: Event): void {
        const value = (event.target as HTMLSelectElement).value;

        this.prioritySelected.emit(value ? (value as TaskPriority) : null);
    }

    protected taskPriorities = [
        {value: TaskPriority.LOW, label: 'Низкий'},
        {value: TaskPriority.MEDIUM, label: 'Средний'},
        {value: TaskPriority.HIGH, label: 'Высокий'},
        {value: TaskPriority.CRITICAL, label: 'Критический'}
    ];
}
