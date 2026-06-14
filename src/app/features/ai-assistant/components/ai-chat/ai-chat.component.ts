import {ChangeDetectionStrategy, Component} from '@angular/core';
import {
    TuiButton,
    TuiIcon,
    TuiInput,
    TuiLabel,
    TuiTextfield
} from '@taiga-ui/core';

import {TuiTextarea} from '@taiga-ui/kit';

@Component({
    selector: 'app-ai-chat',
    imports: [
        TuiIcon,
        TuiInput,
        TuiTextfield,
        TuiLabel,
        TuiButton,
        TuiTextarea
    ],
    templateUrl: './ai-chat.component.html',
    styleUrl: './ai-chat.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiChatComponent {}
