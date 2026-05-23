import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiIcon, TuiButton, TuiInput} from '@taiga-ui/core';
import {BackgroundService} from '../../services/Background.service';
import {AppBackground} from '../../services/Background.service';

@Component({
    selector: 'app-theme-settings',
    imports: [TuiIcon, TuiButton, TuiInput],
    templateUrl: './theme-settings.component.html',
    styleUrl: './theme-settings.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeSettingsComponent {
    backgroundService = inject(BackgroundService);

    protected changeTheme(background: AppBackground) {
        this.backgroundService.toggleTheme(background);
    }
}
