import {Component} from '@angular/core';
import {TuiIcon} from '@taiga-ui/core';
import {TuiSwitch} from '@taiga-ui/kit';
@Component({
    selector: 'app-notifications-settings',
    imports: [TuiIcon, TuiSwitch],
    templateUrl: './notifications-settings.component.html',
    styleUrl: './notifications-settings.component.less'
})
export class NotificationsSettingsComponent {}
