import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiButton, TuiTextfield, TuiInput} from '@taiga-ui/core';

@Component({
    selector: 'app-my-tasks-toolbar',
    imports: [TuiButton, TuiTextfield, TuiInput],
    templateUrl: './my-tasks-toolbar.component.html',
    styleUrl: './my-tasks-toolbar.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyTasksToolbarComponent {}
