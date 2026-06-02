import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {MyTask} from '../interfaces/my-tasks.interface';

@Injectable({
    providedIn: 'root'
})
export class MyTasksService {
    private readonly http = inject(HttpClient);

    private readonly baseApiUrl = 'http://localhost:3000/tasks/my';

    getAllMyTasks() {
        return this.http.get<MyTask[]>(this.baseApiUrl);
    }

    getMyTask(taskId: string) {
        return this.http.get<MyTask>(`${this.baseApiUrl}/${taskId}`);
    }
}
