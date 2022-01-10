import {Presenter} from "../../../framework.visual/extras/presenter";
import LandingPanelView from "./landingPanelView";
import {LoginPanelProps} from "./landingPanelModel";
import {createComponentWrapper} from "../../../framework/wrappers/componentWrapper";
import {createSelector} from "@reduxjs/toolkit";
import {referenceService} from "../../../application/serviceComposition";
import {ReferenceType} from "../../../model";
import {RoleVM} from "../systemToolPanels/profilePanel/profilePanelModel";
import {forEachKVP} from "../../../framework.visual/extras/utils/collectionUtils";

class LandingPanel extends Presenter {
    constructor() {
        super();

        this.id = 'components/LandingPanel';

        this.view = LandingPanelView;

        this.mapStateToProps = (state: any, props: LoginPanelProps) => {
            return {
                roles: this.getRolesVMs(state),
            };
        }

        this.mapDispatchToProps = () => {
            return {

            };
        }

        this.displayOptions = {
            containerId: 'bumed',
            visible: false,
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
