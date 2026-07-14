import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {SuccessResponse} from '../interfaces/user.interface';
import {
    CreateTaskCommentRequest,
    TaskComment,
    UpdateTaskCommentRequest
} from '../interfaces/task-comment.interface';

@Injectable({
    providedIn: 'root'
})
export class TaskCommentsService {
    private readonly http = inject(HttpClient);

    private readonly baseApiUrl = 'http://localhost:3000/projects';

    getTaskComments(projectId: string, taskId: string) {
        return this.http.get<TaskComment[]>(
            `${this.baseApiUrl}/${projectId}/tasks/${taskId}/comments`
        );
    }

    addTaskComment(
        projectId: string,
        taskId: string,
        payload: CreateTaskCommentRequest
    ) {
        return this.http.post<TaskComment>(
            `${this.baseApiUrl}/${projectId}/tasks/${taskId}/comments`,
            payload
        );
    }

    editTaskComment(
        projectId: string,
        taskId: string,
        commentId: string,
        payload: UpdateTaskCommentRequest
    ) {
        return this.http.patch<TaskComment>(
            `${this.baseApiUrl}/${projectId}/tasks/${taskId}/comments/${commentId}`,
            payload
        );
    }

    deleteTaskComment(projectId: string, taskId: string, commentId: string) {
        return this.http.delete<SuccessResponse>(
            `${this.baseApiUrl}/${projectId}/tasks/${taskId}/comments/${commentId}`
        );
    }
}
