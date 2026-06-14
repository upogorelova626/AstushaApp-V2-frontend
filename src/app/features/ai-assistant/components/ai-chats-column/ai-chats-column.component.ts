import {ChangeDetectionStrategy, Component} from '@angular/core';

import {
    TuiIcon,
    TuiInput,
    TuiTextfield,
    TuiButton,
    TuiIcons,
    TuiLabel
} from '@taiga-ui/core';
import {TuiTabs, TuiTab, TuiTabsHorizontal} from '@taiga-ui/kit';

@Component({
    selector: 'app-ai-chats-column',
    imports: [
        TuiButton,
        TuiIcon,
        TuiInput,
        TuiTextfield,
        TuiTabs,
        TuiTab,
        TuiTabsHorizontal,
        TuiLabel
    ],
    templateUrl: './ai-chats-column.component.html',
    styleUrl: './ai-chats-column.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiChatsColumnComponent {}
