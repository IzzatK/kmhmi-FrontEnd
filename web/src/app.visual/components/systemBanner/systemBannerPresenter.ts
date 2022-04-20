import SystemBannerView from './systemBannerView'
import {VisualWrapper} from "../../../framework.visual/extras/visualWrapper";
import {createVisualConnector} from "../../../framework.visual/connectors/visualConnector";
import {
    authenticationService, displayService,
    documentService,
    referenceService, selectionService,
    userService
} from "../../../serviceComposition";
import {ReferenceType, UserInfo} from "../../../app.model";
import {makeGuid} from "../../../framework.core/extras/utils/uniqueIdUtils";
import {createSelector} from "@reduxjs/toolkit";
import {forEachKVP} from "../../../framework.core/extras/utils/collectionUtils";
import {RoleVM} from "./systemBannerModel";
import {UserGuidePanelId} from "../userGuidePanel/userGuidePanelWrapper";

export const DOCUMENT_PREVIEW_VIEW_ID = 'document-preview-panel';

class SystemBanner extends VisualWrapper {
    constructor() {
        super();

        this.id ='components/systemBanner';

        this.view = SystemBannerView;

        this.mapStateToProps = (state: any, props: any) => {
            return {
                userName: this.formatUserName(),
                role: this.getRoleVM(state),
                isLoggedIn: userService.getCurrentUser() !== null,
            }
        }

        this.mapDispatchToProps = () => {
            return {
                onReturnHome: () => this.onReturnHome(),
                onLogout: () => this.onLogout(),
                onShowHelp: () => this.onShowHelp(),
            };
        }
    }

    getRoleVM = createSelector(
        [() => referenceService.getAllReferences(ReferenceType.ROLE), () => userService.getCurrentUser()],
        (roles) => {
            let itemVM: string = "";

            forEachKVP(roles, (itemKey: string, itemValue: RoleVM) => {
                if (userService.getCurrentUser()?.role == itemValue.id) {
                    itemVM = itemValue.title;
                }
            })

            return itemVM;
        }
    )

    formatUserName() {
        const {id, first_name, last_name } = userService.getCurrentUser() || new UserInfo(makeGuid());


        let result = id;
        if (first_name !== undefined) {
            result = first_name;
        }

        if (last_name !== undefined) {
            result += ` ${last_name}`;
        }

        return result;
    }

    onLogout() {
        authenticationService.logout();
        documentService.clearDocuments();
    }

    onReturnHome = () => {
        documentService.clearSearch();
    }

    onShowHelp = () => {
        let currentId = displayService.getSelectedNodeId(DOCUMENT_PREVIEW_VIEW_ID);
        console.log(currentId);

        if (currentId === UserGuidePanelId) {
            displayService.popNode(DOCUMENT_PREVIEW_VIEW_ID);
        }
        else {
            displayService.pushNode(UserGuidePanelId);
        }

        if (selectionService.getContext("selected-report") !== '') {
            selectionService.setContext("selected-report", '');
        }
        if (selectionService.getContext("selected-document") !== '') {
            selectionService.setContext("selected-document", '');
        }
    }
}


export const {
    connectedPresenter: SystemBannerPresenter,
    componentId: SystemBannerId
} = createVisualConnector(SystemBanner);
