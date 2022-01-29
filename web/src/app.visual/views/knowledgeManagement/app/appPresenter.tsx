import React from 'react';
import './App.css';
import {DocumentPanelId} from "../../../components/documentPanel/documentPanelPresenter";
import {Presenter} from "../../../../framework.visual/extras/presenter";
import {createComponentWrapper} from "../../../../framework/wrappers/componentWrapper";
import {
    authorizationService,
    displayService,
    referenceService,
    statService,
    tagService,
    userService
} from "../../../../app.core/serviceComposition";
import {AppView} from "./appView";
import {PermissionsVM, StateProps} from "./appModel";
import {createSelector} from "@reduxjs/toolkit";
import {PermissionInfo} from "../../../../app.model/permissionInfo";
import {PERMISSION_ENTITY, PERMISSION_OPERATOR} from "../../../../app.core.api";

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
                docPreviewTool: displayService.getNodeInfo(DocumentPanelId),
                permissions: this.getPermissions(state)
            }
        }
    }

    getPermissions = createSelector<any, string, Record<string, PermissionInfo>, PermissionsVM>(
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
} = createComponentWrapper(App);

