import {ProjectWorkflowType} from './projects.interface';
import {ProjectPriority} from './projects.interface';

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
