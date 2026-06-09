export const VALIDATION_ERRORS = {
    required: 'Поле обязательно для заполнения',

    email: 'Введите корректный email',

    minlength: ({requiredLength}: {requiredLength: number}) =>
        `Минимальная длина — ${requiredLength} символов`,

    maxlength: ({requiredLength}: {requiredLength: number}) =>
        `Максимальная длина — ${requiredLength} символов`,

    pattern: 'Значение не соответствует необходимому формату',

    passwordMismatch: 'Пароли не совпадают',

    pastDate: 'Выбранная дата не может быть раньше чем сегодня',

    deadlineBeforeStartDate: 'Дедлайн не может быть раньше чем дата старта',

    repositoryUrl:
        'Введите корректную ссылку на GitHub, GitLab или Bitbucket репозиторий'
};
