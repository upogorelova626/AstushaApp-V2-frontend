import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TuiButton, TuiHint, TuiHintDirective, TuiIcon} from '@taiga-ui/core';
import {TuiSkeleton} from '@taiga-ui/kit';

import {UsersService} from '../../../../features/users/services/users.service';

@Component({
    selector: 'app-sidebar',
    imports: [
        TuiIcon,
        TuiButton,
        RouterLink,
        TuiHintDirective,
        TuiHint,
        AsyncPipe
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.less'
})
export class SidebarComponent {
    private readonly usersService = inject(UsersService);
    protected readonly profile$ = this.usersService.profile$;

    protected skeleton = false;
}
