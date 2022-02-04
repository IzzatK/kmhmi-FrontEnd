import {UserInfo} from "../../../../app.model";
import {RegistrationStatusType} from "../../../model/registrationStatusType";

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
    user?: UserInfoVM;
    onSelect?: () => void;
    onCancel?: () => void;
    // userRequests?: UserRequestInfoVM[];
    // userRequest?: UserRequestInfoVM;
    userRequests?: UserInfoVM[];
    userRequest?: UserInfoVM;
    onAcceptUserRequest?: (id: string, role: string) => void;
    onDeclineUserRequest?: (id: string) => void;
    permissions: PermissionsVM;
    searchText?: string;
    onSearch?: () => void;
    onSearchTextChanged?: (value: string) => void;
}

export type PermissionsVM = {
    canModifySelf: boolean;

    canCreate: boolean;
    canDelete: boolean;
    canModify: boolean;
}

export type ProfilePanelState = {
    tmpUser: UserInfoVM;
    isDirty?: boolean;
    isAddingNewUser?: boolean;
    editProperties: EditPropertyVM[];
    selected?: boolean;
    showPopup?: boolean;
    isUpdating?: boolean;
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
    dod_id?: string;
    account_status?: RegistrationStatusType;
    approved_by?: string;
    date_approved?: string;
    isUpdating?: boolean;
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

export type UserRequestInfoVM = {
    id: string;
    name?: string;
    role?: string;
    duration?: string;
    comment?: string;
    isUpdating?: boolean;
}
