import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiIcon, TuiButton, TuiHintDirective} from '@taiga-ui/core';

@Component({
    selector: 'app-theme-card',
    imports: [TuiIcon, TuiButton, TuiHintDirective],
    templateUrl: './theme-card.component.html',
    styleUrl: './theme-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeCardComponent {
    protected openAstushaIdProfileSettings() {
        window.location.href = 'http://localhost:4202/account/settings';
    }
}
