import {
    TaskPriority,
    TaskType
} from '../../projects/interfaces/project-tasks.interface';

export interface ProjectBoardStage {
    id: string;
    projectId: string;

    name: string;
    position: number;

    isStart: boolean;
    isFinal: boolean;

    createdAt: string;
    updatedAt: string;

    tasks: ProjectBoardTask[];
}

export interface ProjectBoardTask {
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

    createdById: string;
    assigneeId: string | null;
    parentId: string | null;

    createdAt: string;
    updatedAt: string;

    createdBy: ProjectBoardUser;
    assignee: ProjectBoardUser | null;
}

export interface ProjectBoardUser {
    id: string;

    login: string;
    email: string;

    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    position: string | null;
    about: string | null;
}
