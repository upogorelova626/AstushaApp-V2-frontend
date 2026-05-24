export enum ProjectWorkflowType {
    SIMPLE = 'SIMPLE',
    DEVELOPMENT = 'DEVELOPMENT',
    DESIGN = 'DESIGN',
    CUSTOM = 'CUSTOM'
}

export enum ProjectPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL'
}

export interface Project {
    id: string;
    title: string;
    key: string;
    description: string;
    workflowType: ProjectWorkflowType;
    priority: ProjectPriority;
    startDate: string;
    deadline: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProjectRequest {
    title: string;
    key: string;
    description: string;
    workflowType: ProjectWorkflowType;
    priority: ProjectPriority;
    startDate: string;
    deadline: string;
}

export interface UpdateProjectRequest {
    title: string;
    description: string;
    priority: ProjectPriority;
    startDate: string;
    deadline: string;
}
