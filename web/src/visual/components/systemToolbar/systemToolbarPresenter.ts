import SystemToolbarView from "./systemToolbarView";
import {createSelector} from "@reduxjs/toolkit";
import {Presenter} from "../../../framework.visual/extras/presenter";
import {createComponentWrapper} from "../../../framework/wrappers/componentWrapper";
import {DocumentPanelId} from "../documentPanel/documentPanelPresenter";
import {DocPreviewSVG} from "../../theme/svgs/docPreviewSVG";
import {forEach} from "../../../framework.visual/extras/utils/collectionUtils";
import {
    authorizationService,
    displayService,
    repoService,
    selectionService
} from "../../../application/serviceComposition";
import {SystemToolMenuItem} from "../../model/systemToolMenuItem";
import {SystemToolVM} from "./systemToolbarModel";
import {PERMISSION_ENTITY, PERMISSION_LEVEL, PERMISSION_OPERATOR} from "../../../api";


export const SYSTEM_TOOLBAR_VIEW_ID = 'system-tool-panel';

class SystemToolbar extends Presenter {
    constructor() {
        super();

        this.id ='components/systemToolbar';

        this.view = SystemToolbarView;

        this.mapStateToProps = (state: any, props: any) => {
            return {
                documentPreviewTool: this.getDocumentPreviewToolVM(state),
                tools: this.getToolVMs(state)
            }
        }

        this.mapDispatchToProps = () => {
            return {
                onDocumentPreviewSelected: () => this.onDocumentPreviewSelected(),
                onToolSelected: (id: string) => this.onToolSelected(id)
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


    getToolVMs = createSelector(
        [ this.getSelectedNode, this.getTools, authorizationService.getPermissions], // if this changes, will re-evaluate the combiner and trigger a re-render
        (selectedId, items) => {
            let itemVMs: Record<string, SystemToolVM> = {};

            forEach(items, (item: SystemToolMenuItem) => {

                let enabled = true;
                switch(item.id) {
                    case 'components/uploadPanel':
                        enabled = authorizationService.getPermissionLevel(PERMISSION_ENTITY.DOCUMENT, PERMISSION_OPERATOR.POST) >= PERMISSION_LEVEL.ANY;
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
        console.log('doc toggle selected');
        displayService.toggleNode(DocumentPanelId);

        if (selectionService.getContext("selected-document") !== '') {
            selectionService.setContext("selected-document", '');
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
}

export const {
    connectedPresenter: SystemToolbarPresenter,
    componentId: SystemToolbarId
} = createComponentWrapper(SystemToolbar);
