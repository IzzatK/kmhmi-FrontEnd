import {Presenter} from "../../../framework.visual/extras/presenter";
import LandingPanelView from "./landingPanelView";
import {LandingPanelDispatchProps, LandingPanelStateProps, UserInfoVM} from "./landingPanelModel";
import {createComponentWrapper} from "../../../framework.visual/wrappers/componentWrapper";
import {createSelector} from "@reduxjs/toolkit";
import {authenticationService, authorizationService} from "../../../serviceComposition";
import {AuthenticationProfile, AuthenticationStatus} from "../../../app.core.api";
import {RegistrationStatusType} from "../../model/registrationStatusType";

class LandingPanel extends Presenter {
    constructor() {
        super();

        this.id = 'components/LandingPanel';

        this.view = LandingPanelView;

        this.mapStateToProps = (state: any, props: any): LandingPanelStateProps => {
            return {
                registrationStatus: this.getAccountStatus(authenticationService.getState()),
                user: this.getCurrentUserProfile(authenticationService.getState())
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

    getAccountStatus = createSelector(
        [(s) => authenticationService.getAuthenticationStatus(), (s) => authorizationService.isAuthorized()],
        (registerStatus, isAuthorized) => {
            let result = RegistrationStatusType.NONE;

            if (isAuthorized) {
               result = RegistrationStatusType.ACTIVE;
            }
            else {
                switch (registerStatus) {
                    case AuthenticationStatus.NONE:
                        result = RegistrationStatusType.NONE;
                        break;
                    case AuthenticationStatus.CREATED:
                        result = RegistrationStatusType.CREATED;
                        break;
                    case AuthenticationStatus.ACTIVE:
                        result = RegistrationStatusType.ACTIVE;
                        break;
                    case AuthenticationStatus.REJECTED:
                        result = RegistrationStatusType.REJECTED;
                        break;

                }

            }

            return result;
        }
    )

    getCurrentUserProfile = createSelector(
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


