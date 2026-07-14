import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject
} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {TuiRoot} from '@taiga-ui/core';
import {UsersService} from './features/users/services/users.service';
import {Theme} from './shared/interfaces/auth.interface';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, TuiRoot],
    templateUrl: './app.component.html',
    styleUrl: './app.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    private readonly usersService = inject(UsersService);

    private readonly profile = toSignal(this.usersService.profile$, {
        initialValue: null
    });

    protected readonly tuiTheme = computed(() =>
        this.profile()?.theme === Theme.DARK ? 'dark' : 'light'
    );
}
