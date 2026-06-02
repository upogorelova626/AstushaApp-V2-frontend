import {ProjectTask} from '../../projects/interfaces/project-tasks.interface';

export enum TaskType {
    TASK = 'TASK',
    BUG = 'BUG',
    STORY = 'STORY',
    EPIC = 'EPIC',
    SUBTASK = 'SUBTASK'
}

export interface ProjectTaskProject {
    id: string;
    title: string;
    key: string;
    priority: string;
    startDate: string | null;
    deadline: string | null;
}

export interface MyTask extends ProjectTask {
    project: ProjectTaskProject;
}
