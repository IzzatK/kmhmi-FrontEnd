import {RegistrationStatusType} from "../../model/registrationStatusType";

export type LandingPanelStateProps = {
    className?: string;
    registrationStatus: RegistrationStatusType;
    user: UserInfoVM;
}

export type LoginPanelDispatchProps = {

}

export type LoginPanelProps = LandingPanelStateProps & LoginPanelDispatchProps;

export type LoginPanelState = {

}

export type UserInfoVM = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
}
