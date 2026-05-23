import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'app-not-found-page',
    imports: [],
    templateUrl: './not-found-page.component.html',
    styleUrl: './not-found-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundPageComponent {}
