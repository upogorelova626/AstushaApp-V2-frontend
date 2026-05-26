import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Injector
} from '@angular/core';
import {
    TuiButton,
    TuiTextfield,
    TuiInput,
    TuiNotificationService,
    TuiDialogService
} from '@taiga-ui/core';
import {TuiDataListWrapper} from '@taiga-ui/kit';
import {RouterOutlet} from '@angular/router';
import {switchMap} from 'rxjs';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';

import {CreateProjectDialogComponent} from './create-project-dialog/create-project-dialog.component';

@Component({
    selector: 'app-projects-searching',
    imports: [
        TuiButton,
        TuiTextfield,
        TuiInput,
        TuiDataListWrapper,
        RouterOutlet
    ],
    templateUrl: './projects-searching.component.html',
    styleUrl: './projects-searching.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsSearchingComponent {
    private readonly alerts = inject(TuiNotificationService);
    private readonly dialogs = inject(TuiDialogService);
    private readonly injector = inject(Injector);

    protected click() {
        this.dialogs
            .open<string>(
                new PolymorpheusComponent(
                    CreateProjectDialogComponent,
                    this.injector
                ),
                {
                    label: 'Создайте новый проект',
                    size: 'l'
                }
            )
            .pipe(switchMap(name => this.alerts.open(name)))
            .subscribe();
    }
}
