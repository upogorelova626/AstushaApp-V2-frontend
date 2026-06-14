import {Project} from '../../features/projects/interfaces/project.interface';

export interface ProjectOutletData {
    project: Project;
    projectId: string;
    updateProject: (project: Project) => void;
    canManageProject: boolean;
}
