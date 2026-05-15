import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {
    TuiTextfieldComponent,
    TuiIcon,
    TuiButton,
    TuiInput
} from '@taiga-ui/core';

@Component({
    selector: 'app-forgot-password',
    imports: [TuiTextfieldComponent, TuiIcon, TuiButton, TuiInput, RouterLink],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.less'
})
export class ForgotPasswordComponent {}
