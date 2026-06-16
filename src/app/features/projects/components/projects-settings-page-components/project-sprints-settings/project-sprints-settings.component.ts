import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {TuiIcon} from '@taiga-ui/core';

@Component({
    selector: 'app-project-sprints-settings',
    imports: [TuiIcon],
    templateUrl: './project-sprints-settings.component.html',
    styleUrl: './project-sprints-settings.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectSprintsSettingsComponent {
    sprint = signal('');
}
