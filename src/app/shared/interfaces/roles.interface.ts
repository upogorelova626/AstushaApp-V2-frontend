import {TeamRole} from './team-members.interface';

export interface Roles {
    title: string;
    description: string;
    value: TeamRole.Admin | TeamRole.Member;
}
