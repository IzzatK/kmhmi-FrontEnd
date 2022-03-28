import UploadPanelView from "./uploadPanelView";
import {VisualWrapper} from "../../../framework.visual";
import {createVisualConnector} from "../../../framework.visual";
import {createSelector} from "@reduxjs/toolkit";
import {forEach} from "../../../framework.core/extras/utils/collectionUtils";
import {DocumentPanelId} from "../documentPanel/documentPanelPresenter";
import {DocumentInfo, ReferenceType} from "../../../app.model";
import {
    displayService,
    documentService,
    referenceService,
    selectionService
} from "../../../serviceComposition";
import {PendingDocumentVM} from "./uploadPanelModel";

class UploadPanel extends VisualWrapper {
    constructor() {
        super();

        this.id ='app.visual/components/uploadPanel';

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
                onFetchUploadedDocuments: () => this._fetchUploadedDocuments(),
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

    _fetchUploadedDocuments() {
        documentService.fetchUploadedDocuments();
    }

    getSelectedDocumentId = selectionService.makeGetContext("selected-document");

    getPendingFilesVMs = createSelector(
        [(s) => documentService.getPendingDocuments(), (s) => this.getSelectedDocumentId(s), (s) => referenceService.getAllReferences(ReferenceType.STATUS)],
        (items, selectedId, statusReferenceInfos) => {
            let itemVMs: Record<string, PendingDocumentVM> = {};

            forEach(items, (itemVM: DocumentInfo) => {
                const {
                    id,
                    file_name,
                    isUpdating,
                    isDeleted,
                    status: doc_status,
                } = itemVM;

                let statusReferenceInfo = statusReferenceInfos[doc_status];

                let status = '';

                if (!isDeleted) {
                    if (statusReferenceInfo) {
                        status = statusReferenceInfo.title;
                    }
                    else {
                        switch (doc_status) {
                            case "DRAFT":
                                status = "UPLOADING";
                                break;
                            case "PROCESSING":
                            case "ERROR":
                            case "CREATED":
                                status = "PROCESSING";
                                break;
                            case "PDF_AVAILABLE":
                            case "SEARCHABLE":
                            case "NLP_COMPLETE":
                                status = "COMPLETE";
                                break;
                            case "FAILED":
                                status = "FAILED";
                                break;
                            case "CANCELLED":
                                status = "CANCELLED";
                                break;
                            default:
                                break;
                        }
                    }
                }

                let newId: string = id;
                let newStatus: string = status;
                let newIsDeleted: boolean = isDeleted || false;

                if (id === file_name) {
                    if (itemVMs[file_name]) {
                        newId = itemVMs[file_name].id || id;

                        newStatus = itemVMs[file_name].status || status;

                        newIsDeleted = itemVMs[file_name].deleted || isDeleted || false;
                    }
                }

                itemVMs[itemVM.file_name] = {
                    id: newId,
                    file_name: file_name,
                    isUpdating: isUpdating,
                    status: newStatus,
                    selected: newId == selectedId,
                    deleted: newIsDeleted,
                }

            });

            return itemVMs;
        }
    )
}

export const {
    connectedPresenter: UploadPanelPresenter,
    componentId: UploadPanelId
} = createVisualConnector(UploadPanel);
