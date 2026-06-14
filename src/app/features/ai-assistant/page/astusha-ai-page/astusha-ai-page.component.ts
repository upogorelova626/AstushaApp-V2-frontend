import {Component} from '@angular/core';
import {AiChatsColumnComponent} from '../../components/ai-chats-column/ai-chats-column.component';
import {AiChatComponent} from '../../components/ai-chat/ai-chat.component';

@Component({
    selector: 'app-astusha-ai-page',
    imports: [AiChatsColumnComponent, AiChatComponent],
    templateUrl: './astusha-ai-page.component.html',
    styleUrl: './astusha-ai-page.component.less'
})
export class AstushaAiPageComponent {}
