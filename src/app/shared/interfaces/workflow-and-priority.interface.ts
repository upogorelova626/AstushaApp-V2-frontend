import {ProjectWorkflowType} from './project.enums';
import {ProjectPriority} from './project.enums';

export interface WorkflowTypeOption {
    title: string;
    description: string;
    value: ProjectWorkflowType;
}
export interface ProjectPriorityOption {
    title: string;
    description: string;
    value: ProjectPriority;
}
