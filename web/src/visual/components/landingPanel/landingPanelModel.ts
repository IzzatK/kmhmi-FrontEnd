import {Nullable} from "../../../framework/extras/typeUtils";

export type LoginPanelStateProps = {
    className: string;
    isError: boolean;
    isUnregistered: boolean;
    isAuthPending: boolean;
    isLogin: boolean;
    isRegister: boolean;
    isAuthRequest: boolean;
    user: Nullable<UserInfoVM>;
    admin: Nullable<UserInfoVM>;
    roles?: Record<string, RoleVM>;
    isLogout: boolean;
}

export type LoginPanelDispatchProps = {
    onSubmit: (user: UserInfoVM, remember?: boolean) => void;
    onGetInfo: () => void;
    onReload: () => void;
    onClose: () => void;
}

export type LoginPanelProps = LoginPanelStateProps & LoginPanelDispatchProps;

export type LoginPanelState = {
    isRemember: boolean;
    tmpUser: UserInfoVM;
}

export type UserInfoVM = {
    [key: string]: any;
    dodId?: string;
    name?: string;
    email?: string;
    phone?: string;
    organization?: string;
    pin?: string;
    role?: string;
    request?: string;
}

export type RoleVM = {
    title: string;
}
