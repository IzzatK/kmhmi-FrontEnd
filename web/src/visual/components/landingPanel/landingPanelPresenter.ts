import {Presenter} from "../../../framework.visual/extras/presenter";
import LandingPanelView from "./landingPanelView";
import {LoginPanelDispatchProps, LoginPanelProps, LoginPanelStateProps, UserInfoVM} from "./landingPanelModel";
import {createComponentWrapper} from "../../../framework/wrappers/componentWrapper";
import {createSelector} from "@reduxjs/toolkit";
import {authenticationService, referenceService} from "../../../application/serviceComposition";
import {ReferenceType, UserInfo} from "../../../model";
import {RoleVM} from "../systemToolPanels/profilePanel/profilePanelModel";
import {forEachKVP} from "../../../framework.visual/extras/utils/collectionUtils";
import {makeGuid} from "../../../framework.visual/extras/utils/uniqueIdUtils";

class LandingPanel extends Presenter {
    constructor() {
        super();

        this.id = 'components/LandingPanel';

        this.view = LandingPanelView;

        this.mapStateToProps = (state: any, props: any): LoginPanelStateProps => {
            return {
                user: null,
                admin: null,
                className: "",
                isAuthPending: false,
                isAuthRequest: false,
                isError: false, // no common access card
                isLogin: true,
                isRegister: false,
                isUnregistered: false, // not recognized as authorized user
                roles: this.getRolesVMs(state),
                isLogout: false,
            };
        }

        this.mapDispatchToProps = (): LoginPanelDispatchProps => {
            return {
                onClose: () => {},
                onGetInfo: () => {},
                onReload: () => {},
                onSubmit: () => {
                    authenticationService.login()
                },
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

    register(userVM: UserInfoVM) {
        let user = new UserInfo(makeGuid());

        user.dod_id = userVM.dodId ? Number.parseFloat(userVM.dodId) : -1;
        user.first_name = userVM.fist_name || '';
        user.last_name = userVM.last_name || '';
        user.email_address = userVM.email || '';

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


