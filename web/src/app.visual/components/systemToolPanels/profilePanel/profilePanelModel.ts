import {UserInfo} from "../../../../app.model";
import {RegistrationStatusType} from "../../../model/registrationStatusType";

export type ProfilePanelProps = {
    className?: string;

    currentUser?: UserInfoVM;
    user?: UserInfoVM;
    users?: UserInfoVM[];
    tmpUser?: UserInfoVM;
    // userRequest?: UserRequestInfoVM;
    userRequest?: UserInfoVM;
    // userRequests?: UserRequestInfoVM[];
    userRequests?: UserInfoVM[];
    userLookUp?: Record<string, UserInfo>;
    roles?: Record<string, RoleVM>;
    departments?: Record<string, DepartmentVM>;
    accountStatuses?: Record<string, AccountStatusVM>;
    permissions: PermissionsVM;

    searchText?: string;
    selected?: boolean;
    dirty?: boolean;

    onUserUpdated?: (user: any) => void;
    onUserAdded?: (user: UserInfoVM) => void;
    onUserRemoved?: (id: string) => void;
    onAcceptUserRequest?: (id: string, role?: string) => void;
    onDeclineUserRequest?: (id: string) => void;
    onSearchTextChanged?: (value: string) => void;
    onSearch?: () => void;
    onClearSearch?: () => void;
    onSelect?: () => void;
    onCancel?: () => void;
    onEdit?: () => void;
    onTmpUserChanged?: (id: string, name: string, value: string) => void;
}

export type PermissionsVM = {
    canModifySelf: boolean;
    canCreate: boolean;
    canDelete: boolean;
    canModify: boolean;
}

export type ProfilePanelState = {
    tmpUser?: UserInfoVM;
    tmpUsers?: Record<string, UserInfoVM>;
    isDirty?: boolean;
    isAddingNewUser?: boolean;
    editProperties: EditPropertyVM[];
    selected?: boolean;
    showPopup?: boolean;
    isUpdating?: boolean;
    isOpen?: Record<string, string>;
    isEdit?: Record<string, string>;
    errorMessages?: Record<string, string>;
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
    registration_reason?: string;
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
