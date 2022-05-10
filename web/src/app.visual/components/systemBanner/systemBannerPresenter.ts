import SystemBannerView from './systemBannerView'
import {VisualWrapper} from "../../../framework.visual/extras/visualWrapper";
import {createVisualConnector} from "../../../framework.visual/connectors/visualConnector";
import {
    authenticationService, displayService,
    documentService,
    referenceService, userGuideService,
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
        displayService.pushNode('app.visual/components/searchGraphsPanel');
    }

    getHelpDocument = () => {
        let userGuide = userGuideService.getUserGuide();
        return userGuide?.preview_url;
    };

    onShowHelp = () => {
        let userProfile = authenticationService.getUserProfile();
        let username = userProfile.username;
        let id = userProfile.id;
        let email = userProfile.email;
        let firstName = userProfile.firstName;
        let lastName = userProfile.lastName;

        let preview_url = this.getHelpDocument();

        let token = authenticationService.getToken();

        let xhr = new XMLHttpRequest;

        xhr.open( "GET", preview_url || "");

        xhr.addEventListener( "load", function(){
            window.open(preview_url);
        }, false);

        xhr.setRequestHeader("km-token", `bearer ${token}` );
        xhr.setRequestHeader("km-user-name", username );
        xhr.setRequestHeader("km-user-id", id );
        xhr.setRequestHeader("km-email", email );
        xhr.setRequestHeader("km-first-name", firstName );
        xhr.setRequestHeader("km-last-name", lastName );

        xhr.send();
    }
}


export const {
    connectedPresenter: SystemBannerPresenter,
    componentId: SystemBannerId
} = createVisualConnector(SystemBanner);
