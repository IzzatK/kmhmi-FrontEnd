import React, {Component} from 'react';
import './App.css';
import {DocumentPanelId, DocumentPanelPresenter} from "../../components/documentPanel/documentPanelPresenter";
import {SystemToolbarPresenter} from "../../components/systemToolbar/systemToolbarPresenter";
import {UploadPanelPresenter} from "../../components/systemToolPanels/uploadPanel/uploadPanelPresenter";
import {ProfilePanelPresenter} from "../../components/systemToolPanels/profilePanel/profilePanelPresenter";
import {TagsPanelPresenter} from "../../components/systemToolPanels/tagsPanel/tagsPanelPresenter";
import {StatsPanelPresenter} from "../../components/systemToolPanels/statsPanel/statsPanelPresenter";
import {Presenter} from "../../../framework.visual/extras/presenter";
import {createComponentWrapper} from "../../../framework/wrappers/componentWrapper";

import {SearchViewPresenter} from "./searchView/searchView";
import {ReferenceInfo} from "../../../model";
import {ReferenceType} from "../../../model";
import {forEachKVP} from "../../../framework.visual/extras/utils/collectionUtils";
import {createSelector} from "@reduxjs/toolkit";
import {
    appDataStore,
    displayService,
    referenceService,
    repoService,
    statService, tagService, userService
} from "../../../application/serviceComposition";


class AppPresenter extends Presenter {
    constructor() {
        super();

        this.id ='view/appview';

        this.view = AppView;

        this.displayOptions = {
            containerId: 'bumed',
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

        this.mapStateToProps = (state: any, props: any) => {
            return {
                currentSystemTool: displayService.getSelectedNodeId('system-tool-panel'),
                docPreviewTool: displayService.getNodeInfo(DocumentPanelId),
                references: repoService.getAll(ReferenceInfo.class),
                departments: this.getDepartmentVMs(state),
            }
        }

        setInterval(() => {
           this.fetchData();
        }, 300000); // 5 minutes
        this.fetchData();


    }

    fetchData() {
        statService.fetchStats();
        userService.fetchUsers();
        tagService.fetchTags();
        forEachKVP(ReferenceType, (key: any, value: ReferenceType) => {
            referenceService.fetchReferences(value);
        });
    }

    getDepartmentVMs = createSelector(
        [() => referenceService.getAllReferences(ReferenceType.DEPARTMENT)],
        (departments) => {
            let itemVMs: any = {};

            forEachKVP(departments, (itemKey: string, itemValue: any) => {
                itemVMs[itemKey] = {
                    ...itemValue
                };
            })

            return itemVMs;
        }
    )
}

type Props = {
    className: string;
    currentSystemTool: any;
    docPreviewTool: any;
}

type State = {

}

class AppView extends Component<Props, State> {
    render() {
        const { className, currentSystemTool, docPreviewTool, ...rest } = this.props;


        const {visible:docVisible } = docPreviewTool || {};

        let cn = `${className ? className : ''} d-flex flex h-100`;

        return (
            <div id={'analysis'} {...rest} className={cn}>
                <SearchViewPresenter className={"flex-fill flex-basis-0"} style={{zIndex: '1'}} />
                <div className={docVisible ? "view-container system-tools-panel flex-fill flex-basis-0 position-relative slideRightIn-active" : 'view-container slideRightOut-active'}>
                    <DocumentPanelPresenter className={docVisible ? 'flex-fill flex-basis-0' : ''} style={{zIndex: '9999'}}/>
                </div>
                <div className={currentSystemTool ? "view-container system-tools-panel flex-fill flex-basis-0 position-relative slideRightIn-active" : 'view-container slideRightOut-active'}>
                    <UploadPanelPresenter/>
                    <ProfilePanelPresenter/>
                    <TagsPanelPresenter/>
                    <StatsPanelPresenter/>
                </div>
                <SystemToolbarPresenter style={{zIndex: '1'}}/>
            </div>
        );
    }
}

export const {
    connectedPresenter: App,
    componentId: AppId
} = createComponentWrapper(AppPresenter);

