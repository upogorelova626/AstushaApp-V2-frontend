import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject,
    output
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiButton, TuiInput, TuiTextfield} from '@taiga-ui/core';
import {debounceTime, distinctUntilChanged, map} from 'rxjs';

@Component({
    selector: 'app-my-tasks-toolbar',
    imports: [TuiButton, TuiTextfield, TuiInput, ReactiveFormsModule],
    templateUrl: './my-tasks-toolbar.component.html',
    styleUrl: './my-tasks-toolbar.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyTasksToolbarComponent {
    private readonly destroyRef = inject(DestroyRef);

    readonly searchChanged = output<string>();

    protected readonly search = new FormControl('', {
        nonNullable: true
    });

    constructor() {
        this.search.valueChanges
            .pipe(
                map(value => value.trim()),
                debounceTime(250),
                distinctUntilChanged(),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(value => {
                this.searchChanged.emit(value);
            });
    }
}
