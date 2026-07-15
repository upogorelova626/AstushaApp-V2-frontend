import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PersonalInfoCardComponent} from '../components/personal-info-card/personal-info-card.component';
import {DeleteProfileCardComponent} from '../components/delete-profile-card/delete-profile-card.component';
import {SecurityCardComponent} from '../components/security-card/security-card.component';
import {ThemeCardComponent} from '../components/theme-card/theme-settings.component';
import {NotificationsCardComponent} from '../components/notifications-card/notifications-card.component';

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
