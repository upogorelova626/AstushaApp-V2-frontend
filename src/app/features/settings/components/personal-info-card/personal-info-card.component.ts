import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal
} from '@angular/core';
import {
    TuiButton,
    TuiInput,
    TuiTextfield,
    TuiTextfieldComponent
} from '@taiga-ui/core';
import {TuiAvatar, TuiSkeleton, TuiTextarea} from '@taiga-ui/kit';
import {finalize, take} from 'rxjs';
import {UsersService} from '../../../users/services/users.service';
import {AuthUser} from '../../../auth/models/interfaces/auth.interface';

@Component({
    selector: 'app-personal-info-card',
    imports: [
        TuiAvatar,
        TuiButton,
        TuiTextfieldComponent,
        TuiInput,
        TuiTextfield,
        TuiTextarea,
        TuiSkeleton
    ],
    templateUrl: './personal-info-card.component.html',
    styleUrl: './personal-info-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalInfoCardComponent implements OnInit {
    private readonly usersService = inject(UsersService);

    protected readonly isProfileLoading = signal(true);
    protected readonly me = signal<AuthUser | null>(null);

    ngOnInit(): void {
        this.usersService
            .getMyProfile()
            .pipe(
                take(1),
                finalize(() => this.isProfileLoading.set(false))
            )
            .subscribe(profile => {
                this.me.set(profile);
            });
    }
    protected openAstushaIdProfileSettings() {
        window.location.href = 'http://localhost:4202/account/settings';
    }
}
