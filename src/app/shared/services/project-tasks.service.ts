import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {
    CreateProjectTaskRequest,
    MoveProjectTaskRequest,
    ProjectTask,
    UpdateProjectTaskRequest
} from '../../../shared/interfaces/project-tasks.interface';

@Injectable({
    providedIn: 'root'
})
export class ProjectTasksService {
    private readonly http = inject(HttpClient);

    private readonly baseApiUrl = 'http://localhost:3000/projects';

    createTask(payload: CreateProjectTaskRequest, projectId: string) {
        return this.http.post<ProjectTask>(
            `${this.baseApiUrl}/${projectId}/tasks`,
            payload
        );
    }

    getAllTasks(projectId: string) {
        return this.http.get<ProjectTask[]>(
            `${this.baseApiUrl}/${projectId}/tasks`
        );
    }

    getOneTask(projectId: string, taskId: string) {
        return this.http.get<ProjectTask>(
            `${this.baseApiUrl}/${projectId}/tasks/${taskId}`
        );
    }

    editTask(
        projectId: string,
        taskId: string,
        payload: UpdateProjectTaskRequest
    ) {
        return this.http.patch<ProjectTask>(
            `${this.baseApiUrl}/${projectId}/tasks/${taskId}`,
            payload
        );
    }

    deleteTask(projectId: string, taskId: string) {
        return this.http.delete(
            `${this.baseApiUrl}/${projectId}/tasks/${taskId}`
        );
    }

    moveTask(
        projectId: string,
        taskId: string,
        payload: MoveProjectTaskRequest
    ) {
        return this.http.patch<ProjectTask>(
            `${this.baseApiUrl}/${projectId}/tasks/${taskId}/move`,
            payload
        );
    }
}
