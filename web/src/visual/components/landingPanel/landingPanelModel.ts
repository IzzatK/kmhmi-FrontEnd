export type LoginPanelProps = {
    className: string;
    isError: boolean;
    isUnregistered: boolean;
    isAuthPending: boolean;
    isLogin: boolean;
    isRegister: boolean;
    isAuthRequest: boolean;
    onSubmit: (user: UserInfoVM, remember?: boolean) => void;
    user: UserInfoVM;
    admin: UserInfoVM;
    roles?: Record<string, RoleVM>;
    isLogout?: boolean;
    onGetInfo: () => void;
    onReload: () => void;
    onClose: () => void;
}

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
