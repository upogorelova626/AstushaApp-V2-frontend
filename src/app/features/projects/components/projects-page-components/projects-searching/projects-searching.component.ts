import {
    ChangeDetectionStrategy,
    Component,
    inject,
    output,
    OnInit,
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
import {ReactiveFormsModule, FormControl} from '@angular/forms';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {startWith, switchMap} from 'rxjs';
import {CreateProjectDialogComponent} from './create-project-dialog/create-project-dialog.component';
import {RouterOutlet} from '@angular/router';

@Component({
    selector: 'app-projects-searching',
    imports: [
        TuiButton,
        TuiTextfield,
        TuiInput,
        TuiDataListWrapper,
        ReactiveFormsModule,
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

    readonly searchChanged = output<string>();

    protected readonly search = new FormControl('', {nonNullable: true});

    constructor() {
        this.search.valueChanges.pipe(startWith('')).subscribe(value => {
            this.searchChanged.emit(value.trim().toLowerCase());
        });
    }

    protected click(): void {
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
