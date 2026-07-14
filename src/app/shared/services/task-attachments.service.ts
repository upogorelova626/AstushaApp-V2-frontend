import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {
    TaskAttachment,
    UploadTaskAttachmentsResponse
} from '../interfaces/project-tasks.interface';

@Injectable({
    providedIn: 'root'
})
export class TaskAttachmentsService {
    private readonly http = inject(HttpClient);

    private readonly baseApiUrl = 'http://localhost:3000/projects';

    addAttachments(projectId: string, taskId: string, payload: FormData) {
        return this.http.post<UploadTaskAttachmentsResponse>(
            `${this.baseApiUrl}/${projectId}/tasks/${taskId}/attachments`,
            payload
        );
    }

    getAttachments(projectId: string, taskId: string) {
        return this.http.get<TaskAttachment[]>(
            `${this.baseApiUrl}/${projectId}/tasks/${taskId}/attachments`
        );
    }

    deleteAttachment(projectId: string, taskId: string, attachmentId: string) {
        return this.http.delete(
            `${this.baseApiUrl}/${projectId}/tasks/${taskId}/attachments/${attachmentId}`
        );
    }
}
