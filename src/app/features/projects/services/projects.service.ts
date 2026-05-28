import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {ProjectMember} from '../interfaces/project-member.interface';
import {
    CreateProjectRequest,
    Project,
    ProjectListItem,
    UpdateProjectRequest
} from '../interfaces/project.interface';
import {ProjectTeam, Team} from '../../teams/interfaces/team.interface';

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

    getProjectTeam(projectId: string) {
        return this.http.get<Team | null>(
            `${this.baseApiUrl}/projects/${projectId}/team`
        );
    }

    getProjectTeamCandidates(projectId: string, search: string) {
        return this.http.get<Team[]>(
            `${this.baseApiUrl}/projects/${projectId}/team-candidates`,
            {
                params: {
                    search
                }
            }
        );
    }

    addTeamToProject(projectId: string, payload: {teamId: string}) {
        return this.http.post<ProjectTeam>(
            `${this.baseApiUrl}/projects/${projectId}/teams`,
            payload
        );
    }

    removeProjectTeam(projectId: string, teamId: string) {
        return this.http.delete(
            `${this.baseApiUrl}/projects/${projectId}/teams/${teamId}`
        );
    }

    getProjectMembers(projectId: string) {
        return this.http.get<ProjectMember[]>(
            `${this.baseApiUrl}/projects/${projectId}/members`
        );
    }
}
