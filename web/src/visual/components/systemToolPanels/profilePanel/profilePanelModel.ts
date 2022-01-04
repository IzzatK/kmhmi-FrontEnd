import {UserInfo} from "../../../../model";

export type ProfilePanelProps = {
    className?: string;
    currentUser?: UserInfoVM;
    onUserUpdated?: (user: any) => void;
    onUserAdded?: (user: UserInfoVM) => void;
    users?: UserInfoVM[];
    onUserRemoved?: (id: string) => void;
    roles?: Record<string, RoleVM>;
    departments?: Record<string, DepartmentVM>;
    accountStatuses?: Record<string, AccountStatusVM>;
    userLookUp?: Record<string, UserInfo>;
    isAdmin?: boolean;
    user?: UserInfoVM;
    onSelect?: () => void;
    onCancel?: () => void;
    userRequests?: UserRequestVM[];
    userRequest?: UserRequestVM;
    onAccept?: (id: string) => void;
    onDecline?: (id: string) => void;
}

export type ProfilePanelState = {
    tmpUser: UserInfoVM;
    isDirty?: boolean;
    isAddingNewUser?: boolean;
    editProperties: EditPropertyVM[];
    selected?: boolean;
}

export type UserInfoVM = {
    [key: string]: any;
    id?: string;
    first_name?: string;
    last_name?: string;
    department?: string;
    role?: string;
    email_address?: string;
    phone_number?: string;
    dod_id?: number;
    account_status?: string;
    approved_by?: string;
    date_approved?: string;
}

export type RoleVM = {
    title: string;
}

export type DepartmentVM = {
    title: string;
}

export type AccountStatusVM = {
    id: string,
    title: string,
}

export type EditPropertyVM = {
    id: string;
    placeholder?: string;
    readonly?: boolean;
}

export type UserRequestVM = {
    id: string;
    name?: string;
    role?: string;
    duration?: string;
    reason?: string;
}
