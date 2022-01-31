import {Presenter} from "../../../framework.visual/extras/presenter";
import LandingPanelView from "./landingPanelView";
import {LandingPanelStateProps, LandingPanelDispatchProps, UserInfoVM} from "./landingPanelModel";
import {createComponentWrapper} from "../../../framework/wrappers/componentWrapper";
import {createSelector} from "@reduxjs/toolkit";
import {authenticationService} from "../../../app.core/serviceComposition";
import {AuthenticationProfile, RegistrationStatus} from "../../../app.core.api";
import {RegistrationStatusType} from "../../model/registrationStatusType";

class LandingPanel extends Presenter {
    constructor() {
        super();

        this.id = 'components/LandingPanel';

        this.view = LandingPanelView;

        this.mapStateToProps = (state: any, props: any): LandingPanelStateProps => {
            return {
                registrationStatus: this.getRegistrationStatus(authenticationService.getAuthenticationState()),
                user: this.getCurrentUserProfile(authenticationService.getAuthenticationState())
            };
        }

        this.mapDispatchToProps = (): LandingPanelDispatchProps => {
            return {

            };
        }

        this.displayOptions = {
            containerId: 'bumed',
            visible: true,
            appearClass: 'fadeIn',
            enterClass: 'fadeIn',
            exitClass: 'fadeOut',
        }
    }

    getRegistrationStatus = createSelector<any, RegistrationStatus, RegistrationStatusType>(
        [() => authenticationService.getRegistrationStatus()],
        (registerStatus) => {
            let result = RegistrationStatusType.NONE;

            switch (registerStatus) {
                case RegistrationStatus.NONE:
                    result = RegistrationStatusType.NONE;
                    break;
                case RegistrationStatus.SUBMITTED:
                    result = RegistrationStatusType.SUBMITTED;
                    break;
                case RegistrationStatus.APPROVED:
                    result = RegistrationStatusType.APPROVED;
                    break;
                case RegistrationStatus.REJECTED:
                    result = RegistrationStatusType.REJECTED;
                    break;

            }

            return result;
        }
    )

    getCurrentUserProfile = createSelector<any, AuthenticationProfile, UserInfoVM>(
        [() => authenticationService.getUserProfile()],
        (userProfile) => {
            let userVM: UserInfoVM = {
                id: userProfile.id,
                email: userProfile.email,
                first_name: userProfile.firstName,
                last_name: userProfile.lastName
            };

            return userVM;
        }
    )
}

export const {
    connectedPresenter: LandingPanelPresenter,
    componentId: LandingPanelId,
} = createComponentWrapper(LandingPanel)


