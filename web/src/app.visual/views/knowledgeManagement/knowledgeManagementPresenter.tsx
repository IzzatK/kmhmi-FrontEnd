import React from 'react';
import './knowledgeManagement.css';

import KnowledgeManagementView from "./knowledgeManagementView";
import {KnowledgeManagementDispatchProps, KnowledgeManagementStateProps} from "./knowledgeManagementModel";
import {Presenter} from "../../../framework.visual/extras/presenter";
import {createComponentWrapper} from "../../../framework/wrappers/componentWrapper";
import {authenticationService} from "../../../app.core/serviceComposition";

class KnowledgeManagement extends Presenter {
    constructor() {
        super();

        this.id ='view/knowledge-management';

        this.view = KnowledgeManagementView;

        this.displayOptions = {
            containerId: 'main',
            visible: true,
            appearClass: '',
            enterClass: '',
            exitClass: '',
            timeout: 0
        };

        this.mapDispatchToProps = (dispatch: any): KnowledgeManagementDispatchProps => {
            return {

            }
        }

        this.mapStateToProps = (state: any, props: any): KnowledgeManagementStateProps => {
            return {
                isAuthenticated: authenticationService.isLoggedIn()
            }
        }
    }

    // getPermissions = createSelector<any, string, Record<string, PermissionInfo>, PermissionsVM>(
    //     [() => userService.getCurrentUserId(), authorizationService.getPermissions],
    //     (currentUserId, permissionInfoLookup) => {
    //         let result: PermissionsVM = {
    //             canSearch: authorizationService.hasPermission(PERMISSION_ENTITY.DOCUMENT, PERMISSION_OPERATOR.GET)
    //         }
    //         return result;
    //     }
    // )
}

const tmp:{connectedPresenter: any, componentId: string} = createComponentWrapper(KnowledgeManagement);

export const KnowledgeManagementPresenter = tmp.connectedPresenter;
export const KnowledgeManagementId = tmp.componentId;

export default KnowledgeManagementPresenter;


