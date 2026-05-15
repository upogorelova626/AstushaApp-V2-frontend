import {Component, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TuiAvatar, TuiBreadcrumbs} from '@taiga-ui/kit';
import {TuiButton, TuiTextfield} from '@taiga-ui/core';

import {TuiInput} from '@taiga-ui/core';

@Component({
    selector: 'app-header',
    imports: [
        ReactiveFormsModule,
        TuiAvatar,
        TuiBreadcrumbs,
        TuiButton,
        TuiInput,

        TuiTextfield
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.less'
})
export class HeaderComponent {}
