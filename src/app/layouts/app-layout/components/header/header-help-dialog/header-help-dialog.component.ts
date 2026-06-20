import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiButton, TuiIcon, type TuiDialogContext} from '@taiga-ui/core';
import {injectContext} from '@taiga-ui/polymorpheus';

@Component({
    selector: 'app-header-help-dialog',
    imports: [TuiIcon, TuiButton],
    templateUrl: './header-help-dialog.component.html',
    styleUrl: './header-help-dialog.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderHelpDialogComponent {
    protected readonly context = injectContext<TuiDialogContext<null, null>>();
}
