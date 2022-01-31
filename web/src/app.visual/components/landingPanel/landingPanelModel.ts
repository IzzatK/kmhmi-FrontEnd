import {RegistrationStatusType} from "../../model/registrationStatusType";

export type LandingPanelStateProps = {
    className?: string;
    registrationStatus: RegistrationStatusType;
    user: UserInfoVM;
}

export type LandingPanelDispatchProps = {

}

export type LandingPanelProps = LandingPanelStateProps & LandingPanelDispatchProps;

export type LandingPanelState = {
    loading: boolean;
}

export type UserInfoVM = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
}
