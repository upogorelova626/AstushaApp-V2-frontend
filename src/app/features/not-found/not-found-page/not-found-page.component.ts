import {Location} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';

@Component({
    selector: 'app-not-found-page',
    imports: [TuiButton],
    templateUrl: './not-found-page.component.html',
    styleUrl: './not-found-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundPageComponent {
    private readonly location = inject(Location);

    protected goBack() {
        this.location.back();
    }
}
