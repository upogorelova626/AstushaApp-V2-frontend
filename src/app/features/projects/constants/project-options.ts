import {
    ProjectPriority,
    ProjectWorkflowType
} from '../interfaces/projects.interface';
import {
    ProjectPriorityOption,
    WorkflowTypeOption
} from '../interfaces/workflow-and-priority.interface';

export const PROJECT_WORKFLOW_TYPE_OPTIONS: readonly WorkflowTypeOption[] = [
    {
        title: 'Разработка',
        description:
            'Для команд разработки: задачи проходят этапы от бэклога до тестирования и завершения.',
        value: ProjectWorkflowType.DEVELOPMENT
    },
    {
        title: 'Дизайн',
        description:
            'Для дизайн-процессов: от идеи и макета до ревью и утверждения.',
        value: ProjectWorkflowType.DESIGN
    },
    {
        title: 'Простой процесс',
        description:
            'Универсальный вариант для небольших проектов без сложных этапов.',
        value: ProjectWorkflowType.SIMPLE
    },
    {
        title: 'Свой процесс',
        description:
            'Настраиваемый workflow, где этапы проекта можно задать вручную.',
        value: ProjectWorkflowType.CUSTOM
    }
];

export const PROJECT_PRIORITY_OPTIONS: readonly ProjectPriorityOption[] = [
    {
        title: 'Низкий',
        description:
            'Для проектов без срочных сроков и критичного влияния на работу команды.',
        value: ProjectPriority.LOW
    },
    {
        title: 'Средний',
        description: 'Стандартный приоритет для обычных рабочих проектов.',
        value: ProjectPriority.MEDIUM
    },
    {
        title: 'Высокий',
        description:
            'Важный проект, который требует повышенного внимания команды.',
        value: ProjectPriority.HIGH
    },
    {
        title: 'Критический',
        description:
            'Максимальный приоритет: влияет на ключевые сроки или работу продукта.',
        value: ProjectPriority.CRITICAL
    }
];
