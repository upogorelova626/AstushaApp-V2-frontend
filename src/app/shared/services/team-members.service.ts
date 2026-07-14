import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {
    TeamMember,
    TeamMemberCandidate,
    AddTeamMemberRequest,
    UpdateTeamMemberRequest,
    SuccessResponse
} from '../../../shared/interfaces/team-members.interface';

@Injectable({
    providedIn: 'root'
})
export class TeamMembersService {
    private readonly http = inject(HttpClient);

    private readonly baseApiUrl = 'http://localhost:3000';

    lookupTeamMemberCandidate(teamId: string, identifier: string) {
        return this.http.get<TeamMemberCandidate>(
            `${this.baseApiUrl}/teams/${teamId}/members/lookup`,
            {params: {identifier}}
        );
    }

    getTeamMembers(teamId: string) {
        return this.http.get<TeamMember[]>(
            `${this.baseApiUrl}/teams/${teamId}/members`
        );
    }

    addTeamMember(teamId: string, payload: AddTeamMemberRequest) {
        return this.http.post<TeamMember>(
            `${this.baseApiUrl}/teams/${teamId}/members`,
            payload
        );
    }

    updateTeamMember(
        teamId: string,
        memberId: string,
        payload: UpdateTeamMemberRequest
    ) {
        return this.http.patch<TeamMember>(
            `${this.baseApiUrl}/teams/${teamId}/members/${memberId}`,
            payload
        );
    }

    deleteTeamMember(teamId: string, memberId: string) {
        return this.http.delete<SuccessResponse>(
            `${this.baseApiUrl}/teams/${teamId}/members/${memberId}`
        );
    }
}
