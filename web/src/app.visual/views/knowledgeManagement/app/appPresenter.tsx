import React from 'react';
import './App.css';
import {DocumentPanelId} from "../../../components/documentPanel/documentPanelPresenter";
import {Presenter} from "../../../../framework.visual/extras/presenter";
import {createComponentWrapper} from "../../../../framework/wrappers/componentWrapper";
import {
    authenticationService,
    authorizationService,
    displayService,
    userService
} from "../../../../app.core/serviceComposition";
import {AppView} from "./appView";
import {PermissionsVM, StateProps} from "./appModel";
import {createSelector} from "@reduxjs/toolkit";
import {PermissionInfo} from "../../../../app.model/permissionInfo";
import {PERMISSION_ENTITY, PERMISSION_OPERATOR, RegistrationStatus} from "../../../../app.core.api";
import {NodeInfo} from "../../../../framework/services/displayService/displayService";
import {node} from "prop-types";

class App extends Presenter {
    constructor() {
        super();

        this.id ='view/app';

        this.view = AppView;

        this.displayOptions = {
            containerId: 'view/knowledge-management',
            visible: true,
            appearClass: '',
            enterClass: '',
            exitClass: '',
            timeout: 0
        };

        this.mapDispatchToProps = (dispatch: any) => {
            return {

            }
        }

        this.mapStateToProps = (state: any, props: any): StateProps => {
            return {
                currentSystemTool: displayService.getSelectedNodeId('system-tool-panel'),
                isDocumentVisible: this.isDocumentVisible(state),
                permissions: this.getPermissions(state),
                hasAccess: this.hasAppAccess(authenticationService.getAuthenticationState())
            }
        }
    }

    isDocumentVisible = createSelector<any, NodeInfo, boolean>(
        [() => displayService.getNodeInfo(DocumentPanelId)],
        (nodeInfo) => {
            let result = false;

            if (nodeInfo && nodeInfo.visible) {
                result = true;
            }

            return result;
        }
    )

    getPermissions = createSelector<any, string, Record<string, PermissionInfo>, PermissionsVM>(
        [() => userService.getCurrentUserId(), authorizationService.getPermissions],
        (currentUserId, permissionInfoLookup) => {
            let result: PermissionsVM = {
                canSearch: authorizationService.hasPermission(PERMISSION_ENTITY.DOCUMENT, PERMISSION_OPERATOR.GET, currentUserId, currentUserId)
            }
            return result;
        }
    )

    hasAppAccess = createSelector<any, RegistrationStatus, boolean>(
        [() => authenticationService.getRegistrationStatus()],
        (registerStatus) => {
            let result = false;

            if (registerStatus === RegistrationStatus.APPROVED) {
                result = true;
            }

            return result;
        }
    )
}

export const {
    connectedPresenter: AppPresenter,
    componentId: AppPresenterId
} = createComponentWrapper(App);

