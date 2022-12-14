export type LoginPanelStateProps = {
    className?: string;
    dodWarningAccepted: boolean;
    departments?: Record<string, DepartmentVM>;
}

export type LoginPanelDispatchProps = {
    onLogin: () => void;
    onRegister: (user: UserInfoVM) => void;
    onAgreement: () => void;
}

export type LoginPanelProps = LoginPanelStateProps & LoginPanelDispatchProps;

export type LoginPanelState = {
    tmpUser: UserInfoVM;
    warning: string;
    errorMessages: Record<string, string>;
}

export type UserInfoVM = {
    dod_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    department: string;
    registration_reason: string;
}

export type DepartmentVM = {
    title: string;
}
