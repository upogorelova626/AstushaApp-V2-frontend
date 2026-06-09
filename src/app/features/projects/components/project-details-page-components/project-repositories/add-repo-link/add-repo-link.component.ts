import {HttpErrorResponse} from '@angular/common/http';
import {Component, DestroyRef, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {
    TUI_VALIDATION_ERRORS,
    TuiButton,
    TuiDialogContext,
    TuiError,
    TuiInput,
    TuiTextfield
} from '@taiga-ui/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import {catchError, EMPTY, finalize} from 'rxjs';

import {VALIDATION_ERRORS} from '../../../../../../shared/constants/validation-errors';
import {notBlankValidator} from '../../../../../teams/validators/search-identifier.validator';
import {Project} from '../../../../interfaces/project.interface';
import {ProjectRepositoriesService} from '../../../../services/project-repositories.service';
import {repositoryUrlValidator} from '../../../../validators/repository-url.validator';

@Component({
    selector: 'app-add-repo-link',
    imports: [TuiTextfield, TuiInput, TuiButton, TuiError, ReactiveFormsModule],
    templateUrl: './add-repo-link.component.html',
    styleUrl: './add-repo-link.component.less',
    providers: [
        {
            provide: TUI_VALIDATION_ERRORS,
            useValue: VALIDATION_ERRORS
        }
    ]
})
export class AddRepoLinkComponent {
    protected readonly context =
        injectContext<TuiDialogContext<boolean, Project>>();

    protected readonly project = this.context.data;
    protected readonly isLoading = signal(false);

    private readonly destroyRef = inject(DestroyRef);
    private readonly projectReposService = inject(ProjectRepositoriesService);

    protected readonly link = new FormControl('', {
        nonNullable: true,
        validators: [
            Validators.required,
            Validators.maxLength(500),
            notBlankValidator,
            repositoryUrlValidator
        ]
    });

    protected addLink(): void {
        this.link.markAsTouched();
        this.link.updateValueAndValidity();

        if (this.link.invalid || this.isLoading()) {
            return;
        }

        const url = this.link.getRawValue().trim();

        this.isLoading.set(true);

        this.projectReposService
            .addRepo(this.project.id, {url})
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    this.link.setErrors({
                        ...this.link.errors,
                        serverError: this.getErrorMessage(error)
                    });

                    this.link.markAsTouched();

                    return EMPTY;
                }),
                finalize(() => {
                    this.isLoading.set(false);
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                this.context.completeWith(true);
            });
    }

    private getErrorMessage(error: HttpErrorResponse): string {
        const message = error.error?.message;

        if (Array.isArray(message)) {
            return message[0] ?? 'Не удалось добавить репозиторий';
        }

        return message || 'Не удалось добавить репозиторий';
    }
}
