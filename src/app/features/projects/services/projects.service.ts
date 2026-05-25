import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {
    Project,
    CreateProjectRequest,
    UpdateProjectRequest,
    ProjectListItem
} from '../interfaces/projects.interface';

@Injectable({
    providedIn: 'root'
})
export class ProjectsService {
    private readonly http = inject(HttpClient);

    private readonly baseApiUrl = 'http://localhost:3000';

    createProject(payload: CreateProjectRequest) {
        return this.http.post<Project>(`${this.baseApiUrl}/projects`, payload);
    }

    getProjects() {
        return this.http.get<ProjectListItem[]>(`${this.baseApiUrl}/projects`);
    }

    getOneProject(projectId: string) {
        return this.http.get<Project>(
            `${this.baseApiUrl}/projects/${projectId}`
        );
    }

    updateProject(projectId: string, payload: UpdateProjectRequest) {
        return this.http.patch<Project>(
            `${this.baseApiUrl}/projects/${projectId}`,
            payload
        );
    }

    deleteProject(projectId: string) {
        return this.http.delete(`${this.baseApiUrl}/projects/${projectId}`);
    }
}
