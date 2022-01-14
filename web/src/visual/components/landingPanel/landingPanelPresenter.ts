import {Presenter} from "../../../framework.visual/extras/presenter";
import LandingPanelView from "./landingPanelView";
import {LoginPanelDispatchProps, LoginPanelProps, LoginPanelStateProps, UserInfoVM} from "./landingPanelModel";
import {createComponentWrapper} from "../../../framework/wrappers/componentWrapper";
import {createSelector} from "@reduxjs/toolkit";
import {authenticationService, referenceService} from "../../../application/serviceComposition";
import {ReferenceType} from "../../../model";
import {RoleVM} from "../systemToolPanels/profilePanel/profilePanelModel";
import {forEachKVP} from "../../../framework.visual/extras/utils/collectionUtils";

class LandingPanel extends Presenter {
    constructor() {
        super();

        this.id = 'components/LandingPanel';

        this.view = LandingPanelView;

        this.mapStateToProps = (state: any, props: any): LoginPanelStateProps => {
            return {
                admin: null,
                className: "",
                isAuthPending: false,
                isAuthRequest: false,
                isError: false, // no common access card
                isLogin: true,
                isRegister: false,
                isUnregistered: false, // not recognized as authorized user
                user: null,
                roles: this.getRolesVMs(state),
                isLogout: false,
            };
        }

        this.mapDispatchToProps = (): LoginPanelDispatchProps => {
            return {
                onClose(): void {
                },
                onGetInfo(): void {
                },
                onReload(): void {
                },
                onSubmit(user: UserInfoVM, remember: boolean | undefined): void {
                    authenticationService.doLogin()
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
