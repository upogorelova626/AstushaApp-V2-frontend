import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {
    CreateTeamRequest,
    DeleteTeamResponse,
    Team,
    UpdateTeamRequest
} from '../interfaces/team.interface';

@Injectable({
    providedIn: 'root'
})
export class TeamsService {
    private readonly http = inject(HttpClient);

    private readonly baseApiUrl = 'http://localhost:3000';

    createTeam(payload: CreateTeamRequest) {
        return this.http.post<Team>(`${this.baseApiUrl}/teams`, payload);
    }

    getTeams() {
        return this.http.get<Team[]>(`${this.baseApiUrl}/teams`);
    }

    getOneTeam(teamId: string) {
        return this.http.get<Team>(`${this.baseApiUrl}/teams/${teamId}`);
    }

    editTeam(teamId: string, payload: UpdateTeamRequest) {
        return this.http.patch<Team>(
            `${this.baseApiUrl}/teams/${teamId}`,
            payload
        );
    }

    deleteTeam(teamId: string) {
        return this.http.delete<DeleteTeamResponse>(
            `${this.baseApiUrl}/teams/${teamId}`
        );
    }
}
