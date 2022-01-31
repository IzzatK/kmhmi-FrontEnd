import {Presenter} from "../../../framework.visual/extras/presenter";
import LandingPanelView from "./landingPanelView";
import {LoginPanelDispatchProps, LoginPanelStateProps, UserInfoVM} from "./landingPanelModel";
import {createComponentWrapper} from "../../../framework/wrappers/componentWrapper";
import {createSelector} from "@reduxjs/toolkit";
import {authenticationService, referenceService} from "../../../app.core/serviceComposition";
import {ReferenceType, UserInfo} from "../../../app.model";
import {RoleVM} from "../systemToolPanels/profilePanel/profilePanelModel";
import {forEachKVP} from "../../../framework.visual/extras/utils/collectionUtils";
import {makeGuid} from "../../../framework.visual/extras/utils/uniqueIdUtils";
import {RegistrationStatus} from "../../../app.core.api";
import {RegistrationStatusType} from "../../model/registrationStatusType";

class LandingPanel extends Presenter {
    constructor() {
        super();

        this.id = 'components/LandingPanel';

        this.view = LandingPanelView;

        this.mapStateToProps = (state: any, props: any): LoginPanelStateProps => {
            return {
                registrationStatus: this.getRegistrationStatus(authenticationService.getAuthenticationState()),
            };
        }

        this.mapDispatchToProps = (): LoginPanelDispatchProps => {
            return {
                onLogin: () =>  {
                    authenticationService.login();
                },
                onRegister: (user: UserInfoVM) => {
                    this.register(user);
                }
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

    register(userVM: UserInfoVM) {
        let user = new UserInfo(makeGuid());

        user.dod_id = userVM.dod_id || '';
        user.first_name = userVM.first_name || '';
        user.last_name = userVM.last_name || '';
        user.email_address = userVM.email || '';
        user.phone_number = userVM.phone || '';

        authenticationService.register(user);
    }

    getRolesVMs = createSelector(
        [() => referenceService.getAllReferences(ReferenceType.ROLE)],
        (roles) => {
            let itemVMs: Record<string, RoleVM> = {};

            forEachKVP(roles, (itemKey: string, itemValue: RoleVM) => {
                itemVMs[itemKey] = {
                    ...itemValue
                };
            })

            return itemVMs;
        }
    )
}

export const {
    connectedPresenter: LandingPanelPresenter,
    componentId: LandingPanelId,
} = createComponentWrapper(LandingPanel)


