import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'app-user-profile-page',
    imports: [],
    templateUrl: './user-profile-page.component.html',
    styleUrl: './user-profile-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfilePageComponent {}
