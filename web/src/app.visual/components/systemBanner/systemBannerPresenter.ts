import SystemBannerView from './systemBannerView'
import {VisualWrapper} from "../../../framework.visual/extras/visualWrapper";
import {createVisualConnector} from "../../../framework.visual/connectors/visualConnector";
import {
    authenticationService, displayService,
    documentService,
    referenceService, selectionService, userGuideService,
    userService
} from "../../../serviceComposition";
import {ReferenceType, UserInfo} from "../../../app.model";
import {makeGuid} from "../../../framework.core/extras/utils/uniqueIdUtils";
import {createSelector} from "@reduxjs/toolkit";
import {forEachKVP} from "../../../framework.core/extras/utils/collectionUtils";
import {RoleVM, UserGuideInfoVM} from "./systemBannerModel";

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

        userGuideService.fetchUserGuide();
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
        displayService.pushNode('app.visual/views/search');
        selectionService.setContext("selected-document", "");
        selectionService.setContext("selected-report", "");
        selectionService.setContext("selected-pocket", "");
        displayService.popNode(DOCUMENT_PREVIEW_VIEW_ID);
    }

    getHelpDocument = () => {
        let userGuide = userGuideService.getUserGuide();
        return userGuide?.preview_url;
    };

    onShowHelp = () => {
        let preview_url = this.getHelpDocument();

        let token = authenticationService.getToken();

        let xhr = new XMLHttpRequest();

        xhr.open( "GET", preview_url || "", true);

        xhr.setRequestHeader("Authorization", `bearer ${token}` );

        xhr.responseType = "blob";
        xhr.onload = function () {
            //Create a Blob from the PDF Stream
            const file = new Blob([xhr.response], { type: "application/pdf" });
            //Build a URL from the file
            const fileURL = URL.createObjectURL(file);
            //Open the URL on new Window
            const pdfWindow = window.open();
            if (pdfWindow) {
                pdfWindow.location.href = fileURL;
            }
        };

        xhr.send();
    }
}


export const {
    connectedPresenter: SystemBannerPresenter,
    componentId: SystemBannerId
} = createVisualConnector(SystemBanner);
