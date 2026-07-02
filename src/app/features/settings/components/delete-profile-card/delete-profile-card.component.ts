import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiIcon, TuiButton} from '@taiga-ui/core';

@Component({
    selector: 'app-delete-profile-card',
    imports: [TuiIcon, TuiButton],
    templateUrl: './delete-profile-card.component.html',
    styleUrl: './delete-profile-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteProfileCardComponent {
    protected openAstushaIdSecuritySettings() {
        window.location.href = 'http://localhost:4202/account/security';
    }
}
