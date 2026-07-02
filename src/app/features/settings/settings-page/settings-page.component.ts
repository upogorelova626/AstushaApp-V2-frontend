import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PersonalInfoCardComponent} from '../components/personal-info-settings/personal-info-card.component';
import {DeleteProfileCardComponent} from '../components/delete-profile/delete-profile-card.component';
import {SecurityCardComponent} from '../components/security-settings/security-card.component';
import {ThemeCardComponent} from '../components/theme-settings/theme-settings.component';
import {NotificationsCardComponent} from '../components/notifications-settings/notifications-card.component';

@Component({
    selector: 'app-settings-page',
    imports: [
        PersonalInfoCardComponent,
        DeleteProfileCardComponent,
        SecurityCardComponent,
        ThemeCardComponent,
        NotificationsCardComponent
    ],
    templateUrl: './settings-page.component.html',
    styleUrl: './settings-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPageComponent {}
