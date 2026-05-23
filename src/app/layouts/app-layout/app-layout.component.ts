import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {BackgroundService} from '../../features/settings/services/Background.service';

@Component({
    selector: 'app-app-layout',
    imports: [RouterOutlet, HeaderComponent, SidebarComponent],
    templateUrl: './app-layout.component.html',
    styleUrl: './app-layout.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppLayoutComponent {
    private readonly backgroundService = inject(BackgroundService);

    protected readonly background = this.backgroundService.background;
}
