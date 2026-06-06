import {AsyncPipe} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnDestroy,
    OnInit,
    signal
} from '@angular/core';
import {
    TUI_VALIDATION_ERRORS,
    TuiButton,
    TuiError,
    TuiInput,
    TuiTextfield,
    TuiTextfieldComponent
} from '@taiga-ui/core';
import {
    TuiAvatar,
    TuiFile,
    TuiFiles,
    TuiSkeleton,
    TuiTextarea
} from '@taiga-ui/kit';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import {finalize, Observable, of, Subject, switchMap, take} from 'rxjs';

import {UsersService} from '../../../users/services/users.service';
import {
    ProfileFormValue,
    UserProfileResponse
} from '../../../users/models/interfaces/user.interface';
import {VALIDATION_ERRORS} from '../../../../shared/constants/validation-errors';

@Component({
    selector: 'app-personal-info-settins',
    imports: [
        AsyncPipe,
        ReactiveFormsModule,
        TuiAvatar,
        TuiButton,
        TuiTextfieldComponent,
        TuiInput,
        TuiTextfield,
        TuiTextarea,
        TuiSkeleton,
        TuiError,
        TuiFiles,
        TuiFile
    ],
    templateUrl: './personal-info-settings.component.html',
    styleUrl: './personal-info-settings.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: TUI_VALIDATION_ERRORS,
            useValue: VALIDATION_ERRORS
        }
    ]
})
export class PersonalInfoSettinsComponent implements OnInit, OnDestroy {
    private readonly usersService = inject(UsersService);

    private readonly maxAvatarSize = 5 * 1024 * 1024;

    private readonly allowedAvatarTypes = [
        'image/jpeg',
        'image/png',
        'image/webp'
    ];

    protected readonly isEditing = signal(false);
    protected readonly isSaving = signal(false);
    protected readonly isProfileLoading = signal(true);

    protected readonly avatarPreviewUrl = signal<string | null>(null);

    private readonly selectedAvatarFile = signal<File | null>(null);

    protected readonly avatarControl = new FormControl<File | null>({
        value: null,
        disabled: true
    });

    protected readonly failedAvatarFile$ = new Subject<File | null>();
    protected readonly loadingAvatarFile$ = new Subject<File | null>();

    protected readonly loadedAvatarFile$ = this.avatarControl.valueChanges.pipe(
        switchMap(file => this.processAvatarFile(file))
    );

    private initialFormValue: ProfileFormValue | null = null;

    protected readonly form = new FormGroup({
        email: new FormControl(
            {
                value: '',
                disabled: true
            },
            {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.email,
                    Validators.maxLength(255)
                ]
            }
        ),
        firstName: new FormControl('', {
            nonNullable: true,
            validators: [Validators.minLength(2), Validators.maxLength(50)]
        }),
        lastName: new FormControl('', {
            nonNullable: true,
            validators: [Validators.minLength(2), Validators.maxLength(50)]
        }),
        position: new FormControl('', {
            nonNullable: true,
            validators: [Validators.minLength(2), Validators.maxLength(100)]
        }),
        about: new FormControl('', {
            nonNullable: true,
            validators: [Validators.maxLength(500)]
        }),
        avatarUrl: new FormControl(
            {
                value: '',
                disabled: true
            },
            {
                nonNullable: true
            }
        )
    });

    ngOnInit(): void {
        this.form.disable();
        this.isProfileLoading.set(true);

        this.usersService
            .getMyProfile()
            .pipe(
                take(1),
                finalize(() => this.isProfileLoading.set(false))
            )
            .subscribe(profile => {
                const formValue = this.mapProfileToFormValue(profile);

                this.form.patchValue(formValue);
                this.initialFormValue = formValue;

                this.form.markAsPristine();
                this.form.markAsUntouched();
            });
    }

    ngOnDestroy(): void {
        this.clearAvatarPreview();

        this.failedAvatarFile$.complete();
        this.loadingAvatarFile$.complete();
    }

    protected startEditing(): void {
        this.isEditing.set(true);

        this.form.enable();

        this.form.controls.email.disable();
        this.form.controls.avatarUrl.disable();

        this.avatarControl.enable();
    }

    protected cancelEditing(): void {
        if (this.initialFormValue) {
            this.form.patchValue(this.initialFormValue);
        }

        this.removeAvatarFile();

        this.form.markAsPristine();
        this.form.markAsUntouched();

        this.form.disable();
        this.form.controls.email.disable();
        this.form.controls.avatarUrl.disable();

        this.avatarControl.disable();
        this.isEditing.set(false);
    }

    protected saveProfile(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();

            return;
        }

        this.isSaving.set(true);

        this.usersService
            .changeMyProfile(this.buildProfileFormData())
            .pipe(finalize(() => this.isSaving.set(false)))
            .subscribe(profile => {
                const formValue = this.mapProfileToFormValue(profile);

                this.form.patchValue(formValue);
                this.initialFormValue = formValue;

                this.removeAvatarFile();

                this.form.markAsPristine();
                this.form.markAsUntouched();

                this.form.disable();
                this.form.controls.email.disable();
                this.form.controls.avatarUrl.disable();

                this.avatarControl.disable();
                this.isEditing.set(false);
            });
    }

    protected removeAvatarFile(): void {
        this.selectedAvatarFile.set(null);
        this.avatarControl.setValue(null);

        this.failedAvatarFile$.next(null);
        this.loadingAvatarFile$.next(null);

        this.clearAvatarPreview();
    }

    protected deleteAvatar(): void {
        this.isSaving.set(true);

        this.usersService
            .deleteMyAvatar()
            .pipe(finalize(() => this.isSaving.set(false)))
            .subscribe(profile => {
                const formValue = this.mapProfileToFormValue(profile);

                this.form.patchValue(formValue);
                this.initialFormValue = formValue;

                this.removeAvatarFile();
            });
    }

    protected onAvatarSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0] ?? null;

        this.avatarControl.setValue(file);

        input.value = '';
    }

    protected processAvatarFile(file: File | null): Observable<File | null> {
        this.selectedAvatarFile.set(null);

        this.failedAvatarFile$.next(null);
        this.loadingAvatarFile$.next(null);

        this.clearAvatarPreview();

        if (!file) {
            return of(null);
        }

        this.loadingAvatarFile$.next(file);

        if (!this.isAllowedAvatarFile(file)) {
            this.failedAvatarFile$.next(file);

            return of(null).pipe(
                finalize(() => this.loadingAvatarFile$.next(null))
            );
        }

        this.selectedAvatarFile.set(file);
        this.avatarPreviewUrl.set(URL.createObjectURL(file));
        this.form.markAsDirty();

        return of(file).pipe(
            finalize(() => this.loadingAvatarFile$.next(null))
        );
    }

    private buildProfileFormData(): FormData {
        const {firstName, lastName, position, about} = this.form.getRawValue();

        const formData = new FormData();

        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('position', position);
        formData.append('about', about);

        const avatar = this.selectedAvatarFile();

        if (avatar) {
            formData.append('avatar', avatar);
        }

        return formData;
    }

    private mapProfileToFormValue(
        profile: UserProfileResponse
    ): ProfileFormValue {
        return {
            email: profile.email,
            firstName: profile.firstName ?? '',
            lastName: profile.lastName ?? '',
            position: profile.position ?? '',
            about: profile.about ?? '',
            avatarUrl: profile.avatarUrl ?? ''
        };
    }

    private isAllowedAvatarFile(file: File): boolean {
        return (
            this.allowedAvatarTypes.includes(file.type) &&
            file.size <= this.maxAvatarSize
        );
    }

    private clearAvatarPreview(): void {
        const previewUrl = this.avatarPreviewUrl();

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            this.avatarPreviewUrl.set(null);
        }
    }
}
