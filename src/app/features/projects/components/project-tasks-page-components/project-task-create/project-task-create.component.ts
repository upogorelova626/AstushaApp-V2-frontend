import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {
    TuiButton,
    TuiCalendar,
    TuiDataList,
    TuiDropdown,
    TuiIcon,
    TuiInput,
    TuiOption,
    TuiTextfield,
    TuiTitle
} from '@taiga-ui/core';
import {TuiChevron, TuiInputDate, TuiTextarea} from '@taiga-ui/kit';

@Component({
    selector: 'app-project-task-create',
    imports: [
        ReactiveFormsModule,
        TuiButton,
        TuiCalendar,
        TuiChevron,
        TuiDataList,
        TuiDropdown,
        TuiIcon,
        TuiInput,
        TuiInputDate,
        TuiOption,
        TuiTextarea,
        TuiTextfield,
        TuiTitle
    ],
    templateUrl: './project-task-create.component.html',
    styleUrl: './project-task-create.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectTaskCreateComponent {}
