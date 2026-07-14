import {
    TaskPriority,
    TaskType
} from '../../../shared/interfaces/project-tasks.interface';

export interface SelectOption<T> {
    label: string;
    value: T;
}

export const TASK_TYPE_ITEMS: SelectOption<TaskType>[] = [
    {
        label: 'Баг',
        value: TaskType.BUG
    },
    {
        label: 'Эпик',
        value: TaskType.EPIC
    },
    {
        label: 'История',
        value: TaskType.STORY
    },
    {
        label: 'Подзадача',
        value: TaskType.SUBTASK
    },
    {
        label: 'Задача',
        value: TaskType.TASK
    }
];

export const TASK_PRIORITY_ITEMS: SelectOption<TaskPriority>[] = [
    {
        label: 'Низкий',
        value: TaskPriority.LOW
    },
    {
        label: 'Средний',
        value: TaskPriority.MEDIUM
    },
    {
        label: 'Высокий',
        value: TaskPriority.HIGH
    },
    {
        label: 'Критический',
        value: TaskPriority.CRITICAL
    }
];
