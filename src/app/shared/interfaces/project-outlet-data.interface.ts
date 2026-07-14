import {Project} from './project.interface';

export interface ProjectOutletData {
    project: Project;
    projectId: string;
    updateProject: (project: Project) => void;
    canManageProject: boolean;
}
