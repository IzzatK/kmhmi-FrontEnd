import SystemToolbarView from "./systemToolbarView";
import {createSelector} from "@reduxjs/toolkit";
import {Presenter} from "../../../framework.visual/extras/presenter";
import {createComponentWrapper} from "../../../framework.visual/wrappers/componentWrapper";
import {DocumentPanelId} from "../documentPanel/documentPanelPresenter";
import {DocPreviewSVG} from "../../theme/svgs/docPreviewSVG";
import {forEach} from "../../../framework.visual/extras/utils/collectionUtils";
import {
    authorizationService,
    displayService,
    repoService,
    selectionService
} from "../../../serviceComposition";
import {SystemToolMenuItem} from "../../../app.model";
import {SystemToolVM} from "./systemToolbarModel";
import {PERMISSION_ENTITY, PERMISSION_OPERATOR} from "../../../app.core.api";
import {UploadPanelId} from "../systemToolPanels/uploadPanel/uploadPanelPresenter";
import {ReportPanelId} from "../reportPanel/reportPanelPresenter";


export const SYSTEM_TOOLBAR_VIEW_ID = 'system-tool-panel';
export const DOCUMENT_PREVIEW_VIEW_ID = 'document-preview-panel';

class SystemToolbar extends Presenter {
    constructor() {
        super();

        this.id ='components/systemToolbar';

        this.view = SystemToolbarView;

        this.mapStateToProps = (state: any, props: any) => {
            return {
                documentPreviewTool: this.getDocumentPreviewToolVM(state),
                reportTool: this.getReportToolVM(state),
                tools: this.getToolVMs(state),
            }
        }

        this.mapDispatchToProps = () => {
            return {
                onDocumentPreviewSelected: () => this.onDocumentPreviewSelected(),
                onReportSelected: () => this.onReportSelected(),
                onToolSelected: (id: string) => this.onToolSelected(id),
            };
        }
    }

    getTools = () => {
        return repoService.getAll<SystemToolMenuItem>(SystemToolMenuItem.class);
    }

    onToolSelected(nextId: string) {
        let currentId = displayService.getSelectedNodeId(SYSTEM_TOOLBAR_VIEW_ID)

        if (currentId === nextId) {
            displayService.popNode(SYSTEM_TOOLBAR_VIEW_ID);
        }
        else {
            displayService.pushNode(nextId);
        }
    }


    getSelectedNode = () => {
        return displayService.getSelectedNodeId(SYSTEM_TOOLBAR_VIEW_ID);
    }

    getDocumentNodeInfo = () => {
        return displayService.getNodeInfo(DocumentPanelId);
    }

    getReportNodeInfo = () => {
        return displayService.getNodeInfo(ReportPanelId);
    }

    getToolVMs = createSelector(
        [ this.getSelectedNode, this.getTools, authorizationService.getPermissions], // if this changes, will re-evaluate the combiner and trigger a re-render
        (selectedId, items) => {
            let itemVMs: Record<string, SystemToolVM> = {};

            forEach(items, (item: SystemToolMenuItem) => {

                let enabled = true;
                switch(item.id) {
                    case UploadPanelId:
                        enabled = authorizationService.hasPermission(PERMISSION_ENTITY.DOCUMENT, PERMISSION_OPERATOR.POST);
                        break;
                }

                if (enabled) {
                    itemVMs[item.id] = {
                        ...item,
                        selected: selectedId === item.id
                    };
                }
            });

            return Object.values(itemVMs);
        }
    );

    onDocumentPreviewSelected() {
        // displayService.toggleNode(DocumentPanelId);
        let currentId = displayService.getSelectedNodeId(DOCUMENT_PREVIEW_VIEW_ID)
        console.log(currentId);

        if (currentId === DocumentPanelId) {
            displayService.popNode(DOCUMENT_PREVIEW_VIEW_ID);
        }
        else {
            displayService.pushNode(DocumentPanelId);
        }

        if (selectionService.getContext("selected-document") !== '') {
            selectionService.setContext("selected-document", '');
        }
    }

    onReportSelected() {
        let currentId = displayService.getSelectedNodeId(DOCUMENT_PREVIEW_VIEW_ID)
        console.log(currentId);

        if (currentId === ReportPanelId) {
            displayService.popNode(DOCUMENT_PREVIEW_VIEW_ID);
        }
        else {
            displayService.pushNode(ReportPanelId);
        }
    }

    getDocumentPreviewToolVM = createSelector(
        [this.getDocumentNodeInfo],
        (nodeInfo) => {
            const itemVM = {
                id: DocumentPanelId,
                graphic: DocPreviewSVG,
                selected: nodeInfo ? nodeInfo.visible : false,
                title: 'Preview'
            }
            return itemVM;
        }
    );

    getReportToolVM = createSelector(
        [this.getReportNodeInfo],
        (nodeInfo) => {
            const itemVM = {
                id: ReportPanelId,
                graphic: DocPreviewSVG,
                selected: nodeInfo ? nodeInfo.visible : false,
                title: 'Report'
            }
            return itemVM;
        }
    );
}

export const {
    connectedPresenter: SystemToolbarPresenter,
    componentId: SystemToolbarId
} = createComponentWrapper(SystemToolbar);
