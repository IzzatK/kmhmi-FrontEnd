import UploadPanelView from "./uploadPanelView";
import {Presenter} from "../../../../framework.visual/extras/presenter";
import {createComponentWrapper} from "../../../../framework/wrappers/componentWrapper";
import {createSelector} from "@reduxjs/toolkit";
import {forEach} from "../../../../framework.visual/extras/utils/collectionUtils";
import {DocumentPanelId} from "../../documentPanel/documentPanelPresenter";
import {DocumentInfo, ReferenceType} from "../../../../app.model";
import {
    displayService,
    documentService,
    referenceService,
    selectionService
} from "../../../../app.core/serviceComposition";
import {PendingDocumentVM} from "./uploadPanelModel";

class UploadPanel extends Presenter {
    constructor() {
        super();

        this.id ='components/uploadPanel';

        this.view = UploadPanelView;

        this.displayOptions = {
            containerId: 'system-tool-panel',
            visible: false,
            appearClass: 'fadeIn',
            enterClass: 'fadeIn',
        };

        this.mapStateToProps = (state: any, props: any) => {
            return {
                pendingFiles: this.getPendingFilesVMs(state)
            }
        }

        this.mapDispatchToProps = () => {
            return {
                onPendingDocumentAdded: (fileList: PendingDocumentVM[]) => documentService.startUpload(fileList),
                onPendingDocumentRemoved: (id: string) => this._removePendingDocument(id),
                onDocumentSelected: (id: string) => this._onDocumentSelected(id),
                onPendingDocumentApproved: (id: string) => this._approvePendingDocument(id),
                onCancelUpload: (id: string) => this._cancelUpload(id),
            };
        }
    }

    _onDocumentSelected(id: string) {
        selectionService.setContext("selected-document", id);
        displayService.showNode(DocumentPanelId);
    }

    _approvePendingDocument(id: string) {
        documentService.approvePendingFile(id);
    }

    _removePendingDocument(id: string) {
        documentService.removePendingFile(id)
    }

    _cancelUpload(id: string) {
        documentService.cancelUpload(id);
    }

    getSelectedDocumentId = selectionService.makeGetContext("selected-document");

    getPendingFilesVMs = createSelector(
        [documentService.getPendingDocuments, this.getSelectedDocumentId, () => referenceService.getAllReferences(ReferenceType.STATUS)],
        (items, selectedId, statusReferenceInfos) => {
            let itemVMs: Record<string, PendingDocumentVM> = {};

            forEach(items, (itemVM: DocumentInfo) => {
                const {
                    id,
                    file_name,
                    isUpdating,
                    isDeleted,
                } = itemVM;

                let statusReferenceInfo = statusReferenceInfos[itemVM.status];


                let status = '';
                if (statusReferenceInfo) {
                    status = statusReferenceInfo.title;
                }
                else {
                    status = itemVM.status;
                }

                itemVMs[itemVM.file_name] = {
                    id: id,
                    file_name: file_name,
                    isUpdating: isUpdating,
                    status,
                    selected: id === selectedId,
                    deleted: isDeleted,
                }

            });

            return itemVMs;
        }
    )
}

export const {
    connectedPresenter: UploadPanelPresenter,
    componentId: UploadPanelId
} = createComponentWrapper(UploadPanel);
