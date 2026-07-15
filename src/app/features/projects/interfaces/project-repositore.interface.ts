export interface ProjectRepository {
    id: string;
    projectId: string;
    url: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProjectRepositoryRequest {
    url: string;
}

export interface UpdateProjectRepositoryRequest {
    url: string;
}
