import {AsyncPipe} from '@angular/common';
import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';
import {TuiButton, TuiHint, TuiHintDirective, TuiIcon} from '@taiga-ui/core';

import {AuthUser} from '../../../../features/auth/models/interfaces/auth.interface';
import {UsersService} from '../../../../features/users/services/users.service';

@Component({
    selector: 'app-sidebar',
    imports: [
        TuiIcon,
        TuiButton,
        RouterLink,
        AsyncPipe,
        TuiHintDirective,
        TuiHint
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.less'
})
export class SidebarComponent implements OnInit {
    private readonly usersService = inject(UsersService);
    private readonly destroyRef = inject(DestroyRef);

    readonly user = signal<AuthUser | null>(null);
    readonly isLoading = signal(false);
    readonly error = signal<string | null>(null);

    ngOnInit(): void {
        this.loadProfile();
    }

    private loadProfile(): void {
        this.isLoading.set(true);
        this.error.set(null);

        this.usersService
            .getMyProfile()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: user => {
                    this.user.set(user);
                    this.isLoading.set(false);
                },
                error: () => {
                    this.error.set('Не удалось загрузить профиль');
                    this.isLoading.set(false);
                }
            });
    }
}
