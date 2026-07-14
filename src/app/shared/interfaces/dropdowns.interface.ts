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

export enum UserMenuAction {
    OpenProfile = 'OPEN_PROFILE',
    OpenSettings = 'OPEN_SETTINGS',
    Logout = 'LOGOUT'
}

export type UserMenuActionOption = DropdownOption<UserMenuAction>;

export enum CreateMenuAction {
    CreateTeam = 'CREATE_TEAM',
    CreateProject = 'CREATE_PROJECT'
}

export type CreateMenuActionOption = DropdownOption<CreateMenuAction>;
