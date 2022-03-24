import React from 'react';
import './App.css';
import {DocumentPanelId} from "../../../components/documentPanel/documentPanelPresenter";
import {VisualWrapper} from "../../../../framework.visual/extras/visualWrapper";
import {createVisualConnector} from "../../../../framework.visual/connectors/visualConnector";
import {
    authorizationService,
    displayService,
    userService
} from "../../../../serviceComposition";
import {AppView} from "./appView";
import {PermissionsVM, StateProps} from "./appModel";
import {createSelector} from "@reduxjs/toolkit";
import {PermissionInfo} from "../../../../app.model";
import {PERMISSION_ENTITY, PERMISSION_OPERATOR} from "../../../../app.core.api";
import {NodeInfo} from "../../../../framework.core/services";
import {ReportPanelId} from "../../../components/reportPanel/reportPanelPresenter";

class App extends VisualWrapper {
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
                isReportVisible: this.isReportVisible(state),
                permissions: this.getPermissions(state),
                isAuthorized: true,//authorizationService.isAuthorized(),
                isAuthorizing: false// authorizationService.isAuthorizing()
            }
        }
    }

    isDocumentVisible = createSelector(
        [() => displayService.getNodeInfo(DocumentPanelId)],
        (nodeInfo) => {
            let result = false;

            if (nodeInfo && nodeInfo.visible) {
                result = true;
            }

            return result;
        }
    )

    isReportVisible = createSelector(
        [() => displayService.getNodeInfo(ReportPanelId)],
        (nodeInfo) => {
            let result = false;

            if (nodeInfo && nodeInfo.visible) {
                result = true;
            }

            return result;
        }
    )

    getPermissions = createSelector(
        [() => userService.getCurrentUserId(), authorizationService.getPermissions],
        (currentUserId, permissionInfoLookup) => {
            let result: PermissionsVM = {
                canSearch: authorizationService.hasPermission(PERMISSION_ENTITY.DOCUMENT, PERMISSION_OPERATOR.GET, currentUserId, currentUserId)
            }
            return result;
        }
    )
}

export const {
    connectedPresenter: AppPresenter,
    componentId: AppPresenterId
} = createVisualConnector(App);

