import {
    ProjectPriority,
    ProjectStatus,
    ProjectWorkflowType
} from './project.enums';
import {ProjectUser} from './project-user.interface';
import {ProjectMember} from './project-member.interface';
import {ProjectTeam} from './project-team.interface';
import {TuiDay} from '@taiga-ui/cdk';

export interface ProjectCounts {
    members: number;
    teams: number;
    tasks: number;
}

export interface ProjectListItem {
    id: string;
    title: string;
    key: string;
    description: string;
    status: ProjectStatus;
    workflowType: ProjectWorkflowType;
    priority: ProjectPriority;
    startDate: string;
    deadline: string;
    completedAt: string | null;
    archivedAt: string | null;
    creatorId: string;
    creator: ProjectUser;
    createdAt: string;
    updatedAt: string;
    _count: ProjectCounts;
}

export interface Project extends ProjectListItem {
    members: ProjectMember[];
    teams: ProjectTeam[];
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
    workflowType: ProjectWorkflowType;
    startDate: string;
    deadline: string;
}

export interface ProjectSettingsFormValue {
    title: string;
    description: string;
    priority: ProjectPriority;
    priorityTitle: string;
    workflowType: ProjectWorkflowType;
    workflowTypeTitle: string;
    startDate: TuiDay | null;
    deadline: TuiDay | null;
}
