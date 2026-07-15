import {ChangeDetectionStrategy, Component} from '@angular/core';
import {
    TuiButton,
    TuiError,
    TuiHint,
    TuiIcon,
    TuiInput,
    TuiTextfield
} from '@taiga-ui/core';

@Component({
    selector: 'app-security-card',
    imports: [TuiIcon, TuiButton, TuiInput, TuiError, TuiTextfield, TuiHint],
    templateUrl: './security-card.component.html',
    styleUrl: './security-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecurityCardComponent {
    protected openAstushaIdProfileSettings() {
        return null;
    }
}
