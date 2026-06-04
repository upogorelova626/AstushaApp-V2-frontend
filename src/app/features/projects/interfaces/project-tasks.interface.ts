import {ProjectWorkflowStage} from './project.interface';
import {ProjectUser} from './project-user.interface';

export enum TaskType {
    TASK = 'TASK',
    BUG = 'BUG',
    STORY = 'STORY',
    EPIC = 'EPIC',
    SUBTASK = 'SUBTASK'
}

export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL'
}

export enum SprintStatus {
    PLANNED = 'PLANNED',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED'
}

export interface ProjectTaskCounts {
    comments: number;
    attachments: number;
    subtasks: number;
}

export interface ProjectTaskSprint {
    id: string;
    name: string;
    goal: string | null;
    status: SprintStatus;
    startDate: string | null;
    endDate: string | null;
}

export interface ProjectTaskWorkflowStage {
    id: string;
    name: string;
    position: number;
    isStart: boolean;
    isFinal: boolean;
}

export interface ProjectTaskParent {
    id: string;
    number: number;
    title: string;
}

export interface ProjectTaskSubtask {
    id: string;
    number: number;
    title: string;
    position: number;
}

export interface ProjectTask {
    id: string;
    projectId: string;
    sprintId: string | null;
    workflowStageId: string;
    number: number;
    position: number;
    title: string;
    description: string | null;
    type: TaskType;
    priority: TaskPriority;
    storyPoints: number | null;
    dueDate: string | null;
    createdById: string | null;
    assigneeId: string | null;
    parentId: string | null;
    createdAt: string;
    updatedAt: string;
    createdBy: ProjectUser | null;
    assignee: ProjectUser | null;
    workflowStage: ProjectTaskWorkflowStage;
    sprint: ProjectTaskSprint | null;
    parent: ProjectTaskParent | null;
    subtasks: ProjectTaskSubtask[];
    _count: ProjectTaskCounts;
}

export interface CreateProjectTaskRequest {
    title: string;
    workflowStageId?: string;
    description?: string;
    type?: TaskType;
    priority?: TaskPriority;
    storyPoints?: number;
    dueDate?: string;
    assigneeId?: string;
    sprintId?: string;
    parentId?: string;
}

export interface UpdateProjectTaskRequest {
    title?: string;
    description?: string | null;
    type?: TaskType;
    priority?: TaskPriority;
    storyPoints?: number | null;
    dueDate?: string | null;
    assigneeId?: string | null;
    sprintId?: string | null;
    parentId?: string | null;
}

export interface MoveProjectTaskRequest {
    workflowStageId: string;
    position?: number;
}

export interface ProjectTasksFilters {
    search?: string;
    type?: TaskType;
    priority?: TaskPriority;
    workflowStageId?: string;
    assigneeId?: string;
    sprintId?: string;
}
