import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {
    ProjectRepository,
    CreateProjectRepositoryRequest
} from '../interfaces/project-repositore.interface';

@Injectable({
    providedIn: 'root'
})
export class ProjectRepositoriesService {
    private readonly http = inject(HttpClient);

    private readonly baseApiUrl = 'http://localhost:3000/projects';

    addRepo(projectId: string, payload: CreateProjectRepositoryRequest) {
        return this.http.post<ProjectRepository>(
            `${this.baseApiUrl}/${projectId}/repositories`,
            payload
        );
    }

    getRepos(projectId: string) {
        return this.http.get<ProjectRepository[]>(
            `${this.baseApiUrl}/${projectId}/repositories`
        );
    }

    deleteRepo(projectId: string, repositoryId: string) {
        return this.http.delete(
            `${this.baseApiUrl}/${projectId}/repositories/${repositoryId}`
        );
    }
}
