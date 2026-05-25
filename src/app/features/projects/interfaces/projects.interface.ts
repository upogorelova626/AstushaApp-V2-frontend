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

export enum ProjectStatus {
    ACTIVE = 'ACTIVE',
    PAUSED = 'PAUSED',
    COMPLETED = 'COMPLETED',
    ARCHIVED = 'ARCHIVED'
}

export interface ProjectCreator {
    id: string;
    login: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    position: string | null;
    about: string | null;
}

export interface ProjectCounts {
    members: number;
    teams: number;
    tasks: number;
}

export interface Project {
    id: string;
    title: string;
    key: string;
    description: string | null;

    status: ProjectStatus;
    workflowType: ProjectWorkflowType;
    priority: ProjectPriority;

    startDate: string | null;
    deadline: string | null;
    completedAt: string | null;
    archivedAt: string | null;

    creatorId: string;

    createdAt: string;
    updatedAt: string;
}

export interface ProjectListItem extends Project {
    creator: ProjectCreator;

    _count: ProjectCounts;
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
