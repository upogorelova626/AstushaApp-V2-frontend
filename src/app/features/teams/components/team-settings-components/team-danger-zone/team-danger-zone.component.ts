import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Injector,
    input
} from '@angular/core';
import {Router} from '@angular/router';
import {
    TuiButton,
    TuiDialogService,
    TuiNotificationService
} from '@taiga-ui/core';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {DeleteTeamDialogComponent} from './delete-team-dialog/delete-team-dialog.component';
import {filter, switchMap, tap, timer} from 'rxjs';
import {TuiAvatar} from '@taiga-ui/kit';

@Component({
    selector: 'app-team-danger-zone',
    imports: [TuiButton, TuiAvatar],
    templateUrl: './team-danger-zone.component.html',
    styleUrl: './team-danger-zone.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamDangerZoneComponent {
    readonly teamId = input.required<string>();

    private readonly alerts = inject(TuiNotificationService);
    private readonly dialogs = inject(TuiDialogService);
    private readonly router = inject(Router);
    private readonly injector = inject(Injector);

    protected openDeleteTeamDialog() {
        this.dialogs
            .open<boolean>(
                new PolymorpheusComponent(
                    DeleteTeamDialogComponent,
                    this.injector
                ),
                {
                    label: 'Удалить команду?',
                    size: 's',
                    data: this.teamId()
                }
            )
            .pipe(
                filter(Boolean),
                tap(() => {
                    this.alerts.open('Команда успешно удалена!').subscribe();
                }),
                switchMap(() => timer(1200)),
                tap(() => {
                    this.router.navigate(['/dashboard/teams']);
                })
            )

            .subscribe();
    }
}
