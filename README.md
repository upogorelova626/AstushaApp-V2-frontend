# AstushaApp

**AstushaApp** - веб-приложение для управления командами, проектами и задачами.

Приложение помогает организовать рабочий процесс: создавать команды, вести проекты, назначать задачи участникам, прикреплять файлы, добавлять ссылки на репозитории и обсуждать задачи в комментариях.

Проект разрабатывается как fullstack pet-project с frontend на Angular и backend на NestJS.

## Возможности

В приложении реализованы и дорабатываются следующие возможности:

* регистрация и авторизация пользователя;
* восстановление доступа к аккаунту;
* редактирование профиля пользователя;
* загрузка и удаление аватара;
* создание команд;
* просмотр команд и участников;
* управление участниками команды;
* создание проектов;
* настройка проекта;
* управление участниками проекта;
* роли в проекте;
* создание задач;
* редактирование задач;
* удаление задач;
* назначение исполнителя задачи;
* типы и приоритеты задач;
* story points и дедлайны;
* workflow-стадии задач;
* прикрепление файлов к задаче;
* удаление файлов задачи;
* комментарии к задачам;
* ссылки на репозитории проекта;
* страница одной задачи;
* страница одного проекта;
* адаптивный интерфейс;
* светлая и тёмная тема.

## Стек технологий

### Frontend

* Angular
* TypeScript
* Angular Signals
* RxJS
* Reactive Forms
* Angular Router
* Taiga UI
* LESS
* HTTP Client

### Backend

* NestJS
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT authentication
* Swagger
* Class Validator
* Class Transformer
* file upload

### Инструменты

* Git
* GitHub
* npm
* Prisma Migrate
* Swagger UI
* Postman / Swagger для проверки API

## Основные сущности

* User
* Team
* TeamMember
* Project
* ProjectMember
* ProjectWorkflowStage
* Task
* TaskComment
* TaskAttachment
* ProjectRepository
* Sprint

## Локальный запуск

### 1. Клонировать репозиторий

```bash
git clone <repository-url>
cd AstushaApp
```

### 2. Установить зависимости frontend

```bash
cd frontend
npm install
```

### 3. Установить зависимости backend

```bash
cd backend/astusha-backend
npm install
```

### 4. Настроить переменные окружения backend

В папке backend необходимо создать `.env` файл.

Пример:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/astusha_db"
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
```

### 5. Запустить миграции Prisma

```bash
npx prisma migrate dev
```

### 6. Запустить backend

```bash
npm run start:dev
```

Backend будет доступен по адресу:

```text
http://localhost:3000
```

### 7. Запустить frontend

```bash
npm start
```

Frontend будет доступен по адресу:

```text
http://localhost:4200
```

## Swagger

После запуска backend документация API доступна через Swagger:

```text
http://localhost:3000/api
```

Проект разработан как pet-project для практики fullstack-разработки на Angular и NestJS.


