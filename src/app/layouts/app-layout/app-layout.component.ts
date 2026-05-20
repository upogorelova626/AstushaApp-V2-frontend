import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';

@Component({
    selector: 'app-app-layout',
    imports: [RouterOutlet, HeaderComponent, SidebarComponent],
    templateUrl: './app-layout.component.html',
    styleUrl: './app-layout.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppLayoutComponent {}
