export interface TaskComment {
    id: string;
    text: string;
    createdAt: string;
    updatedAt: string;
    author: TaskCommentAuthor;
}
export interface TaskCommentAuthor {
    id: string;
    login: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
}

export interface CreateTaskCommentRequest {
    text: string;
}

export interface UpdateTaskCommentRequest {
    text: string;
}
