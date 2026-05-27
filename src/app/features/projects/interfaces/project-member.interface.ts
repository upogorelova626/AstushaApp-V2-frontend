import {ProjectRole} from './project.enums';
import {ProjectUser} from './project-user.interface';

export interface ProjectMember {
    id: string;
    projectId: string;
    userId: string;
    role: ProjectRole;
    createdAt: string;
    updatedAt: string;
    user: ProjectUser;
}
