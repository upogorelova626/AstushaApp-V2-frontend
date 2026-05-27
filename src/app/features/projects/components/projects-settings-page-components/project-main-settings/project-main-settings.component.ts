import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiButton, TuiDropdown, TuiInput, TuiTextfield} from '@taiga-ui/core';
import {TuiChevron, TuiInputDate, TuiTextarea} from '@taiga-ui/kit';

@Component({
    selector: 'app-project-main-settings',
    imports: [
        TuiButton,
        TuiChevron,
        TuiDropdown,
        TuiInput,
        TuiTextarea,
        TuiTextfield
    ],
    templateUrl: './project-main-settings.component.html',
    styleUrl: './project-main-settings.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectMainSettingsComponent {}
