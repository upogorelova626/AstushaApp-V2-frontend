import {AsyncPipe, DecimalPipe} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    input,
    signal
} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiButton, TuiDialogService, TuiIcon} from '@taiga-ui/core';
import {
    type TuiFileLike,
    TuiFiles,
    TuiInputFiles,
    TuiSkeleton
} from '@taiga-ui/kit';
import {finalize, Observable, of, Subject, switchMap} from 'rxjs';
import {
    ProjectTask,
    TaskAttachment
} from '../../../../projects/interfaces/project-tasks.interface';
import {TaskAttachmentsService} from '../../../../projects/services/task-attachments.service';
import {MyTask} from '../../../interfaces/my-tasks.interface';
import {AllTaskFilesDialogComponent} from './all-task-files-dialog/all-task-files-dialog.component';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';

@Component({
    selector: 'app-task-files-card',
    imports: [
        TuiButton,
        TuiIcon,
        TuiSkeleton,
        TuiInputFiles,
        TuiFiles,
        DecimalPipe,
        ReactiveFormsModule,
        AsyncPipe
    ],
    templateUrl: './task-files-card.component.html',
    styleUrl: './task-files-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskFilesCardComponent {
    readonly task = input<ProjectTask | null>(null);
    readonly isLoading = input(false);

    private readonly taskAttachmentsService = inject(TaskAttachmentsService);
    private readonly dialogs = inject(TuiDialogService);

    protected readonly taskAttachments = signal<TaskAttachment[]>([]);
    protected readonly isFileInputVisible = signal(false);
    protected readonly isAttachmentsLoading = signal(false);

    protected readonly isFilesSkeletonVisible = computed(
        () => this.isLoading() || this.isAttachmentsLoading()
    );

    protected readonly control = new FormControl<TuiFileLike | null>(null);

    protected readonly failedFiles$ = new Subject<TuiFileLike | null>();
    protected readonly loadingFiles$ = new Subject<TuiFileLike | null>();

    protected readonly loadedFiles$ = this.control.valueChanges.pipe(
        switchMap(file => this.uploadFile(file))
    );

    protected readonly previewAttachments = computed(() =>
        this.taskAttachments().slice(0, 3)
    );

    protected readonly attachmentsCount = computed(
        () => this.taskAttachments().length
    );

    private readonly loadAttachmentsEffect = effect(() => {
        const task = this.task();

        if (!task) {
            return;
        }

        this.taskAttachments.set(task.attachments ?? []);
        this.isAttachmentsLoading.set(true);

        this.taskAttachmentsService
            .getAttachments(task.projectId, task.id)
            .pipe(finalize(() => this.isAttachmentsLoading.set(false)))
            .subscribe(attachments => {
                this.taskAttachments.set(attachments);
            });
    });

    protected toggleFileInput() {
        this.isFileInputVisible.update(value => !value);
    }

    protected removeFile() {
        this.control.setValue(null);
    }

    private uploadFile(
        file: TuiFileLike | null
    ): Observable<TuiFileLike | null> {
        const task = this.task();

        this.failedFiles$.next(null);

        if (!task || !file || !(file instanceof File)) {
            return of(null);
        }

        this.loadingFiles$.next(file);

        const formData = new FormData();

        formData.append('files', file);

        return this.taskAttachmentsService
            .addAttachments(task.projectId, task.id, formData)
            .pipe(
                switchMap(attachments => {
                    this.taskAttachments.update(current => [
                        ...attachments,
                        ...current
                    ]);

                    this.control.setValue(null, {emitEvent: false});
                    this.isFileInputVisible.set(false);
                    this.failedFiles$.next(null);
                    this.loadingFiles$.next(null);

                    return of(null);
                }),
                finalize(() => {
                    this.loadingFiles$.next(null);
                })
            );
    }

    protected showAllFiles() {
        this.dialogs
            .open<TaskAttachment[]>(
                new PolymorpheusComponent(AllTaskFilesDialogComponent),
                {
                    label: 'Все файлы',
                    size: 'm',
                    data: {
                        attachments: this.taskAttachments(),
                        task: this.task()
                    }
                }
            )
            .subscribe(attachments => {
                if (!attachments) {
                    return;
                }

                this.taskAttachments.set(attachments);
            });
    }

    protected deleteTaskAttachment(attachmentId: string) {
        const task = this.task();

        if (!task) {
            return;
        }

        this.taskAttachmentsService
            .deleteAttachment(task.projectId, task.id, attachmentId)
            .subscribe(() => {
                this.taskAttachments.update(attachments =>
                    attachments.filter(
                        attachment => attachment.id !== attachmentId
                    )
                );
            });
    }
}
