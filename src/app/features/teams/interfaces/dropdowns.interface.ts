export interface DropdownOption<TValue = string> {
    title: string;
    value: TValue;
    description?: string;
}

export enum TeamMemberAction {
    OpenProfile = 'OPEN_PROFILE',
    ChangeRole = 'CHANGE_ROLE',
    Delete = 'DELETE'
}

export type TeamMemberActionOption = DropdownOption<TeamMemberAction>;
