import {TuiDay} from '@taiga-ui/cdk';

import {
    ProjectPriority,
    ProjectStatus,
    ProjectWorkflowType
} from './project.enums';
import {ProjectMember} from './project-member.interface';
import {ProjectTeam} from './project-team.interface';
import {ProjectUser} from './project-user.interface';
import {ProjectRepository} from './project-repositore.interface';

export interface ProjectCounts {
    members: number;
    tasks: number;
}

export interface ProjectWorkflowStage {
    id: string;
    projectId: string;
    name: string;
    position: number;
    isStart: boolean;
    isFinal: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ProjectTeamLink {
    id: string;
    projectId: string;
    teamId: string;
    createdAt: string;
    team: ProjectTeam;
}

export interface ProjectListItem {
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
    creator: ProjectUser;
    createdAt: string;
    updatedAt: string;
    teamLink: ProjectTeamLink | null;
    repositories?: ProjectRepository[];
    _count: ProjectCounts;
}

export interface Project extends ProjectListItem {
    members: ProjectMember[];
    workflowStages: ProjectWorkflowStage[];
}

export interface CreateProjectWorkflowStageRequest {
    name: string;
}

export interface CreateProjectRequest {
    title: string;
    key: string;
    description?: string;
    workflowType?: ProjectWorkflowType;
    workflowStages?: CreateProjectWorkflowStageRequest[];
    priority?: ProjectPriority;
    startDate?: string;
    deadline?: string;
}

export interface UpdateProjectRequest {
    title?: string;
    description?: string;
    priority?: ProjectPriority;
    workflowType?: ProjectWorkflowType;
    startDate?: string;
    deadline?: string;
}

export interface ProjectSettingsFormValue {
    title: string;
    description: string;
    priority: ProjectPriority;
    priorityTitle: string;
    startDate: TuiDay | null;
    deadline: TuiDay | null;
}
