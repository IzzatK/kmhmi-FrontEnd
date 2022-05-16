import {createSelector} from "@reduxjs/toolkit";
import {VisualWrapper} from "../../../framework.visual";
import {createVisualConnector} from "../../../framework.visual";
import {forEach, forEachKVP} from "../../../framework.core/extras/utils/collectionUtils";
import {DocumentPanelId} from "../documentPanel/documentPanelPresenter";
import {
    DocumentInfo,
    MetadataType,
    PocketMapper,
    ReferenceInfo,
    ReferenceType,
    SearchResultsMenuItem,
    SortPropertyInfo
} from "../../../app.model";
import {
    authenticationService,
    authorizationService,
    displayService,
    documentService, pocketService,
    referenceService, reportService,
    repoService,
    selectionService,
    userService
} from "../../../serviceComposition";
import {MenuItemVM} from "../../../framework.visual";
import {
    DocumentInfoVM,
    ObjectType, PocketVM,
    ReferenceInfoVM, SearchResultsPanelAppDispatchProps,
    SearchResultsPanelAppStateProps,
    SortPropertyInfoVM
} from "./searchResultsModel";
import {DOCUMENT_PREVIEW_VIEW_ID} from "../systemToolbar/systemToolbarPresenter";
import SearchResultsPanelPresenter from "./presenters/searchResultsPanelPresenter";
import {PERMISSION_ENTITY, PERMISSION_OPERATOR, PocketParamType, ResourceParamType} from "../../../app.core.api";
import {SearchResultInfo} from "../../../app.model";

class _SearchResultsPanelWrapper extends VisualWrapper {
    constructor() {
        super();

        this.id ='components/searchResultsPanel';

        this.metadataId = MetadataType.DOCUMENTS_GET_ARRAY;

        this.view = SearchResultsPanelPresenter;

        this.mapStateToProps = (state: any, props: any): SearchResultsPanelAppStateProps => {
            return {
                searchResults: this.getSearchResultVMs(state),
                resultViews: this.getResultViewVMs(state),
                selectedResultView: this.getSelectedResultViewId(state),
                sortTypes: this.getSortVMs(state),
                selectedSort: this.getSelectedSort(state),
                userLookup: userService.getActiveUsers(),
                selectedDocument: this.getSelectedDocumentVM(state),
                permissions: this.getPermissions(state),
                pockets: this.getPockets(state),
            };
        }

        this.mapDispatchToProps = (dispatch: any): SearchResultsPanelAppDispatchProps => {
            return {
                onDocumentSelected: (id: string, object_type: ObjectType) => this.onDocumentSelected(id, object_type),
                onResultViewSelected: (id: string) => this.onResultViewSelected(id),
                onSortSelected: (id: string) => this.onSortSelected(id),
                onDelete: (id: string, object_type: ObjectType) => this._onDelete(id, object_type),
                onDownload: (id: string, object_type: ObjectType) => this._onDownload(id, object_type),
                onAddToPocket: (id: string, object_type: ObjectType, pocketId: string) => this._onAddToPocket(id, object_type, pocketId),
            };
        }

        //select card view by default
        this.onResultViewSelected('cardViewId');
    }

    _onDelete(id: string, object_type: ObjectType) {
        switch (object_type) {
            case ObjectType.PocketInfo:
                pocketService.removePocket(id);
                break;
            case ObjectType.ReportInfo:
                reportService.removeReport(id);
                break;
            case ObjectType.DocumentInfo:
            default:
                documentService.removeDocument(id);
                break;
        }
    }

    _onDownload(id: string, object_type: ObjectType) {
        const userProfile = authenticationService.getUserProfile();
        const token = authenticationService.getToken();

        switch (object_type) {
            case ObjectType.PocketInfo:

                break;
            case ObjectType.ReportInfo:

                const report = reportService.getReport(id);

                if (userProfile && report) {
                    const { username, id, email, firstName, lastName } = userProfile;
                    const { original_url } = report;

                    let xhr = new XMLHttpRequest;

                    xhr.open( "GET", original_url || "");

                    xhr.addEventListener( "load", function(){
                        window.open(original_url);
                    }, false);

                    xhr.setRequestHeader("Authorization", `bearer ${token}` );
                    // xhr.setRequestHeader("km-user-name", username );
                    // xhr.setRequestHeader("km-user-id", id );
                    // xhr.setRequestHeader("km-email", email );
                    // xhr.setRequestHeader("km-first-name", firstName );
                    // xhr.setRequestHeader("km-last-name", lastName );

                    xhr.send();
                }
                break;
            case ObjectType.DocumentInfo:
            default:
                const document = documentService.getDocument(id);

                if (userProfile && document) {
                    const { username, id, email, firstName, lastName } = userProfile;
                    const { original_url } = document;

                    let xhr = new XMLHttpRequest;

                    xhr.open( "GET", original_url || "");

                    xhr.addEventListener( "load", function(){
                        window.open(original_url);
                    }, false);

                    xhr.setRequestHeader("Authorization", `bearer ${token}` );
                    // xhr.setRequestHeader("km-user-name", username );
                    // xhr.setRequestHeader("km-user-id", id );
                    // xhr.setRequestHeader("km-email", email );
                    // xhr.setRequestHeader("km-first-name", firstName );
                    // xhr.setRequestHeader("km-last-name", lastName );

                    xhr.send();
                }
                break;
        }
    }

    _onAddToPocket(id: string, object_type: ObjectType, pocketId: string) {

        const resourceParams: ResourceParamType = {
            source_id: id
        }

        if (object_type !== ObjectType.PocketInfo) {
            if (pocketId !== "") {
                const pocketParams: PocketParamType = {
                    id: pocketId
                }

                pocketService.addResourceToPocket(resourceParams, pocketParams);
            } else {
                pocketService.addOrUpdatePocket({title: "New Pocket"})
                    .then(pocketMapper => {
                        if (pocketMapper) {
                            const pocketParams: PocketParamType = {
                                id: pocketMapper.id
                            }

                            pocketService.addResourceToPocket(resourceParams, pocketParams);
                        }
                    })
            }
        }
    }

    getDepartmentVMs = createSelector(
        [() => referenceService.getAllReferences(ReferenceType.DEPARTMENT)],
        (departments) => {
            let itemVMs: Record<string, ReferenceInfoVM> = {};

            forEachKVP(departments, (itemKey: string, itemValue: ReferenceInfo) => {
                itemVMs[itemKey] = {
                    ...itemValue
                };
            })

            return itemVMs;
        }
    )

    getStatusVMs = createSelector(
        [() => referenceService.getAllReferences(ReferenceType.STATUS)],
        (statuses) => {
            let itemVMs: Record<string, ReferenceInfoVM> = {};

            forEachKVP(statuses, (itemKey: string, itemValue: ReferenceInfo) => {
                itemVMs[itemKey] = {
                    ...itemValue
                };
            })

            return itemVMs;
        }
    )

    getPurposeVMs = createSelector(
        [() => referenceService.getAllReferences(ReferenceType.PURPOSE)],
        (purposes) => {
            let itemVMs: Record<string, ReferenceInfoVM> = {};

            forEachKVP(purposes, (itemKey: string, itemValue: ReferenceInfo) => {
                itemVMs[itemKey] = {
                    ...itemValue
                };
            })

            return itemVMs;
        }
    )

    getSelectedDocumentId = selectionService.makeGetContext("selected-document");
    getSelectedPocketId = selectionService.makeGetContext("selected-pocket");
    getSelectedReportId = selectionService.makeGetContext("selected-report");

    getSelectedId = createSelector(
        [
            (s) => this.getSelectedDocumentId(s),
            (s) => this.getSelectedPocketId(s),
            (s) => this.getSelectedReportId(s)
        ],
        (selectedDocumentId, selectedPocketId, selectedReportId) => {

            if (selectedDocumentId && selectedDocumentId !== "") {
                return selectedDocumentId;
            } else if (selectedPocketId && selectedPocketId !== "") {
                return selectedPocketId;
            } else if (selectedReportId && selectedReportId !== "") {
                return selectedReportId;
            }
        }
    )

    getSearchResultVMs = createSelector(
        [
            (s) => documentService.getSearchResults(),
            (s) => this.getSelectedId(s),
            (s) => this.getDepartmentVMs(s),
            (s) => this.getStatusVMs(s),
            (s) => this.getPurposeVMs(s)
        ],
        (items, selectedId, departments, statuses, purposes) => {
            let departmentVMs: Record<string, ReferenceInfoVM> = {};

            forEachKVP(departments, (itemKey: string, itemValue: ReferenceInfoVM) => {
                departmentVMs[itemKey] = {
                    ...itemValue
                };
            })

            let statusVMs: Record<string, ReferenceInfoVM> = {};

            forEachKVP(statuses, (itemKey: string, itemValue: ReferenceInfoVM) => {
                statusVMs[itemKey] = {
                    ...itemValue
                };
            })

            let purposeVMs: Record<string, ReferenceInfoVM> = {};

            forEachKVP(purposes, (itemKey: string, itemValue: ReferenceInfoVM) => {
                purposeVMs[itemKey] = {
                    ...itemValue
                };
            })

            let itemVMs: Record<string, DocumentInfoVM> = {};

            forEach(items, (item: SearchResultInfo) => {

                if (item instanceof DocumentInfo) {
                    const {
                        id,
                        author,
                        department,
                        file_name,
                        file_size,
                        file_page_count,
                        primary_sme_email,
                        primary_sme_name,
                        primary_sme_phone,
                        private_tag,
                        project,
                        public_tag,
                        publication_date,
                        purpose,
                        secondary_sme_email,
                        secondary_sme_name,
                        secondary_sme_phone,
                        status,
                        scope,
                        title,
                        upload_date,
                        uploadedBy_id,
                        isUpdating,
                    } = item;

                    let displayPrivateTags: Record<string, string> = {};
                    if (private_tag) {
                        const current_user_id = userService.getCurrentUserId()
                        if (private_tag[current_user_id]) {
                            displayPrivateTags = private_tag[current_user_id];
                        }
                    }

                    itemVMs[item.id] = {
                        id: id,
                        author: author,
                        department: departmentVMs[department] ? departmentVMs[department].title : department,
                        file_name: title ? file_name : undefined,
                        file_size: file_size,
                        page_count: file_page_count,
                        primary_sme_email: primary_sme_email ? primary_sme_email : "N/A",
                        primary_sme_name: primary_sme_name ? primary_sme_name : "N/A",
                        primary_sme_phone: primary_sme_phone ? primary_sme_email : "N/A",
                        private_tag: displayPrivateTags,
                        project: project,
                        public_tag: public_tag,
                        publication_date: publication_date ? new Date(publication_date).toLocaleString().split(',')[0] : 'No Publication Date',
                        purpose: purposeVMs[purpose] ? purposeVMs[purpose].title : purpose,
                        secondary_sme_email: secondary_sme_email ? secondary_sme_email : "N/A",
                        secondary_sme_name: secondary_sme_name ? secondary_sme_name : "N/A",
                        secondary_sme_phone: secondary_sme_phone ? secondary_sme_phone : "N/A",
                        status: statusVMs[status] ? statusVMs[status].title : status,
                        scope: scope,
                        title: title ? title : file_name,
                        upload_date: upload_date ? new Date(upload_date).toLocaleString().split(',')[0] : 'No Upload Date',
                        uploadedBy_id: uploadedBy_id,
                        selected: id === selectedId,
                        isUpdating: isUpdating,
                        object_type: ObjectType.DocumentInfo,
                    };

                } else if (item instanceof PocketMapper) {
                    const {
                        id,
                        title,
                        isUpdating,
                        author_id,
                        upload_date,
                        uploadedBy_id,
                        scope,
                        private_tag,
                        public_tag
                    } = item.pocket;

                    let displayPrivateTags: Record<string, string> = {};
                    if (private_tag) {
                        const current_user_id = userService.getCurrentUserId()
                        if (private_tag[current_user_id]) {
                            displayPrivateTags = private_tag[current_user_id];
                        }
                    }

                    itemVMs[item.id] = {
                        id: id,
                        author: author_id,
                        private_tag: displayPrivateTags,
                        public_tag: public_tag,
                        scope: scope,
                        title: title,
                        upload_date: upload_date ? new Date(upload_date).toLocaleString().split(',')[0] : 'No Upload Date',
                        uploadedBy_id: uploadedBy_id,
                        selected: id === selectedId,
                        isUpdating: isUpdating,
                        object_type: ObjectType.PocketInfo,
                    };

                } else {
                    const {
                        id,
                        title,
                        scope,
                        private_tag,
                        public_tag,
                        publication_date,
                        upload_date,
                        isUpdating,
                        author_id,
                    } = item;
                    {
                        let displayPrivateTags: Record<string, string> = {};
                        {
                            if (private_tag) {
                                const current_user_id = userService.getCurrentUserId()
                                if (private_tag[current_user_id]) {
                                    displayPrivateTags = private_tag[current_user_id];
                                }
                            }
                            itemVMs[item.id] = {
                                id: id,
                                author: author_id,
                                private_tag: displayPrivateTags,
                                public_tag: public_tag,
                                publication_date: publication_date ? new Date(publication_date).toLocaleString().split(',')[0] : 'No Publication Date',
                                scope: scope,
                                title: title,
                                upload_date: upload_date ? new Date(upload_date).toLocaleString().split(',')[0] : 'No Upload Date',
                                uploadedBy_id: author_id,
                                selected: id === selectedId,
                                isUpdating: isUpdating,
                                object_type: ObjectType.ReportInfo,
                            };
                        }
                    }
                }

            })
            return Object.values(itemVMs);
        }
    );

    getSelectedDocumentVM = createSelector(
        [
            (s) => this.getSelectedDocumentId(s),
            (s) => this.getSelectedPocketId(s),
            (s) => this.getSelectedReportId(s)
        ],
        (selectedDocumentId, selectedPocketId, selectedReportId) => {
            let result: DocumentInfoVM | undefined = undefined;

            if (selectedDocumentId && selectedDocumentId !== "") {
                const document = documentService.getDocument(selectedDocumentId);

                if (document) {
                    const { id, title, file_name, author, uploadedBy_id } = document;

                    result = {
                        id,
                        title: title ? title : file_name,
                        author,
                        object_type: ObjectType.DocumentInfo,
                        uploadedBy_id
                    }
                }
            } else if (selectedPocketId && selectedPocketId !== "") {
                const pocket = pocketService.getPocketInfo(selectedPocketId);

                if (pocket) {
                    const { id, title, author_id, uploadedBy_id } = pocket;

                    result = {
                        id,
                        title,
                        author: author_id,
                        object_type: ObjectType.PocketInfo,
                        uploadedBy_id
                    }
                }
            } else if (selectedReportId && selectedReportId !== "") {
                const report = reportService.getReport(selectedReportId);

                if (report) {
                    const { id, title, author_id, uploadedBy_id } = report;

                    result = {
                        id,
                        title: title,
                        author: author_id,
                        object_type: ObjectType.ReportInfo,
                        uploadedBy_id
                    }
                }

            }

            return result
        }
    )

    onDocumentSelected(id: string, object_type: ObjectType) {
        switch (object_type) {
            case ObjectType.DocumentInfo:
                documentService.fetchDocument(id);
                selectionService.setContext("selected-document", id);
                selectionService.setContext("selected-pocket", '');
                selectionService.setContext("selected-report", '');
                displayService.pushNode(DocumentPanelId);
                break;
            case ObjectType.PocketInfo:
                pocketService.fetchPocket(id);
                selectionService.setContext("selected-pocket", id);
                selectionService.setContext("selected-document", '');
                selectionService.setContext("selected-report", '');
                displayService.popNode(DOCUMENT_PREVIEW_VIEW_ID)
                break;
            case ObjectType.ReportInfo:
                reportService.fetchReport(id);
                selectionService.setContext("selected-report", id);
                selectionService.setContext("selected-document", '');
                selectionService.setContext("selected-pocket", '');
                displayService.pushNode(DocumentPanelId);
                break;
        }
    }

    getResultViews = () => {
        return repoService.getAll<SearchResultsMenuItem>(SearchResultsMenuItem.class);
    }

    getSelectedResultViewId = selectionService.makeGetContext("search-panel-result-view");

    getResultViewVMs = createSelector(
        [(s) => this.getResultViews(), (s) => this.getSelectedResultViewId(s)],
        (items, selectedId) => {
            let itemVMs: Record<string, MenuItemVM> = {};

            forEach(items, (item: SearchResultsMenuItem) => {
                const { id, graphic, context, title} = item;

                itemVMs[id] = {
                    id,
                    graphic,
                    context,
                    title,
                    selected: id === selectedId,
                };
            });

            return itemVMs;
        }
    )

    onResultViewSelected(id: string) {
        selectionService.setContext("search-panel-result-view", id);
    }

    getSortVMs = createSelector(
        [documentService.getSortTypes, documentService.getActiveSortId],
        (items, selectedId) => {
            let itemVMs: Record<string, SortPropertyInfoVM> = {};

            forEach(items, (item: SortPropertyInfo) => {
                const { id, title, value} = item;

                itemVMs[item.id] = {
                    id,
                    title,
                    value,
                    selected: id === selectedId
                };
            });

            return Object.values(itemVMs);
        }
    );

    getSelectedSort = createSelector(
        [documentService.getSortTypes, documentService.getActiveSortId],
        (items, selectedId) => {
            let result = null;

            forEach(items, (item: SortPropertyInfo) => {
                if (item.id === selectedId) {
                    result = item;
                    return true;
                }
            })

            return result;
        }
    )

    onSortSelected(id: string) {
        documentService.setSortParam(id);
        documentService.fetchSearchResults();
    }

    getPermissions = createSelector(
        [(s) => this.getSelectedDocumentVM(s), (s) => userService.getCurrentUserId(), (s) => authorizationService.getPermissions],
        (documentInfoVM, currentUserId, permissionInfoLookup) => {

            let uploadedBy = documentInfoVM?.uploadedBy_id || null;

            return {
                canDelete: authorizationService.hasPermission(PERMISSION_ENTITY.DOCUMENT, PERMISSION_OPERATOR.DELETE, currentUserId, uploadedBy),
                canDownload: authorizationService.hasPermission(PERMISSION_ENTITY.DOCUMENT, PERMISSION_OPERATOR.DOWNLOAD, currentUserId, uploadedBy),
                canModify: authorizationService.hasPermission(PERMISSION_ENTITY.DOCUMENT, PERMISSION_OPERATOR.MODIFY, currentUserId, uploadedBy)
            }
        }
    )

    getPockets = createSelector(
        [() => pocketService.getPocketMappers()],
        (pocketMappers) => {
            let itemVMs: Record<string, PocketVM> = {};

            forEachKVP(pocketMappers, (itemKey: string, itemValue: PocketMapper) => {
                itemVMs[itemKey] = {
                    ["id"]: itemValue.pocket.id,
                    ["title"]: itemValue.pocket.title,
                };
            })

            return itemVMs;
        }
    )
}

export const {
    connectedPresenter: SearchResultsPanelWrapper,
    componentId: SearchResultsPanelId
} = createVisualConnector(_SearchResultsPanelWrapper);
