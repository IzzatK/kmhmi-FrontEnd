import {VisualWrapper} from "../../../framework.visual";
import LoginPanelView from "./loginPanelView";
import {LoginPanelDispatchProps, LoginPanelStateProps, UserInfoVM} from "./loginPanelModel";
import {createVisualConnector} from "../../../framework.visual";
import {authenticationService, authorizationService, referenceService} from "../../../serviceComposition";
import {ReferenceType, UserInfo} from "../../../app.model";
import {makeGuid} from "../../../framework.core/extras/utils/uniqueIdUtils";
import {createSelector} from "@reduxjs/toolkit";
import {DepartmentVM} from "../profilePanel/profilePanelModel";
import {forEachKVP} from "../../../framework.core/extras/utils/collectionUtils";

class LoginPanel extends VisualWrapper {
    constructor() {
        super();

        this.id = 'components/LoginPanel';

        this.view = LoginPanelView;

        this.mapStateToProps = (state: any, props: any): LoginPanelStateProps => {
            return {
                dodWarningAccepted: authorizationService.isDodWarningAccepted(),
                departments: this.getDepartmentVMs(state),
            };
        }

        this.mapDispatchToProps = (): LoginPanelDispatchProps => {
            return {
                onLogin: () =>  {
                    authenticationService.login();
                },
                onRegister: (user: UserInfoVM) => {
                    this.register(user);
                },
                onAgreement: () => {
                    authorizationService.setDodWarningAccepted(true);
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

    register(userVM: UserInfoVM) {
        let user = new UserInfo(makeGuid());

        user.dod_id = userVM.dod_id || '';
        user.first_name = userVM.first_name || '';
        user.last_name = userVM.last_name || '';
        user.email_address = userVM.email || '';
        user.phone_number = userVM.phone || '';
        user.registration_reason = userVM.registration_reason || '';
        user.department = userVM.department || '';

        authenticationService.register(user);
    }

    getDepartmentVMs = createSelector(
        [() => referenceService.getAllReferences(ReferenceType.DEPARTMENT)],
        (departments) => {
            let itemVMs: Record<string, DepartmentVM> = {};

            forEachKVP(departments, (itemKey: string, itemValue: DepartmentVM) => {
                itemVMs[itemKey] = {
                    ...itemValue
                };
            })

            return itemVMs;
        }
    )
}

export const {
    connectedPresenter: LoginPanelPresenter,
    componentId: LoginPanelId,
} = createVisualConnector(LoginPanel)


