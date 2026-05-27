import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject,
    OnInit,
    signal
} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TuiAutoFocus} from '@taiga-ui/cdk';
import {
    TuiButton,
    type TuiDialogContext,
    TuiInput,
    TuiTextfield,
    TuiIcon
} from '@taiga-ui/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import {
    debounceTime,
    distinctUntilChanged,
    EMPTY,
    finalize,
    map,
    switchMap,
    tap
} from 'rxjs';

import {Team} from '../../../../../teams/interfaces/team.interface';
import {ProjectsService} from '../../../../services/projects.service';

@Component({
    selector: 'app-add-team-dialog',
    imports: [
        ReactiveFormsModule,
        TuiAutoFocus,
        TuiButton,
        TuiInput,
        TuiTextfield,
        TuiIcon
    ],
    templateUrl: './add-team-dialog.component.html',
    styleUrl: './add-team-dialog.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddTeamDialogComponent implements OnInit {
    protected readonly context =
        injectContext<TuiDialogContext<string, string>>();

    protected readonly projectId = this.context.data;

    private readonly projectsService = inject(ProjectsService);
    private readonly destroyRef = inject(DestroyRef);

    protected readonly foundTeams = signal<Team[]>([]);
    protected readonly selectedTeam = signal<Team | null>(null);
    protected readonly isSearching = signal(false);

    protected readonly form = new FormControl('', {
        nonNullable: true,
        validators: [Validators.maxLength(100)]
    });

    ngOnInit() {
        this.form.valueChanges
            .pipe(
                debounceTime(500),
                map(name => name.trim()),
                distinctUntilChanged(),
                tap(() => {
                    this.foundTeams.set([]);
                    this.selectedTeam.set(null);
                }),
                switchMap(name => {
                    if (!name || this.form.invalid) {
                        this.isSearching.set(false);

                        return EMPTY;
                    }

                    this.isSearching.set(true);

                    return this.projectsService
                        .getProjectTeamCandidates(this.projectId, name)
                        .pipe(
                            finalize(() => {
                                this.isSearching.set(false);
                            })
                        );
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(teams => {
                this.foundTeams.set(teams);
            });
    }

    protected selectTeam(team: Team) {
        this.selectedTeam.set(team);
        this.form.setValue(team.name, {emitEvent: false});
    }

    protected submit() {
        const team = this.selectedTeam();

        if (!team) {
            return;
        }

        this.context.completeWith(team.id);
    }
}
