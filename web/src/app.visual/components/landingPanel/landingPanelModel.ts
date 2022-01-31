import {RegistrationStatusType} from "../../model/registrationStatusType";

export type LoginPanelStateProps = {
    className?: string;
    registrationStatus: RegistrationStatusType;
}

export type LoginPanelDispatchProps = {
    onLogin: () => void;
    onRegister: (user: UserInfoVM) => void;
}

export type LoginPanelProps = LoginPanelStateProps & LoginPanelDispatchProps;

export type LoginPanelState = {
    tmpUser: UserInfoVM;
}

export type UserInfoVM = {
    dod_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
}
