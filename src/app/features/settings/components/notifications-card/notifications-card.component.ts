import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiIcon} from '@taiga-ui/core';
import {TuiButton} from '@taiga-ui/core';

@Component({
    selector: 'app-notifications-card',
    imports: [TuiIcon, TuiButton],
    templateUrl: './notifications-card.component.html',
    styleUrl: './notifications-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsCardComponent {
    protected openAstushaIdNotificationsSettings() {
        window.location.href = 'http://localhost:4202/account/notifications';
    }
}
