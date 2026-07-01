import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

const ASTUSHA_ID_LOGIN_URL = 'http://localhost:4202/auth/login';

@Component({
    selector: 'app-auth-redirect-page',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthRedirectPageComponent implements OnInit {
    ngOnInit() {
        const returnUrl = `${window.location.origin}/dashboard`;

        window.location.href = `${ASTUSHA_ID_LOGIN_URL}?returnUrl=${encodeURIComponent(returnUrl)}`;
    }
}
