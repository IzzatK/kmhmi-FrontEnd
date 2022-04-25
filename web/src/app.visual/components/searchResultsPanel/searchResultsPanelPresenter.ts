import {createSelector} from "@reduxjs/toolkit";
import SearchResultsPanelView from "./searchResultsPanelView";
import {VisualWrapper} from "../../../framework.visual/extras/visualWrapper";
import {createVisualConnector} from "../../../framework.visual/connectors/visualConnector";
import {forEach, forEachKVP} from "../../../framework.core/extras/utils/collectionUtils";
import {DocumentPanelId} from "../documentPanel/documentPanelPresenter";
import {
    DocumentInfo,
    MetadataType,
    PocketMapper,
    ReferenceInfo,
    ReferenceType,
    ReportInfo,
    SearchResultsMenuItem,
    SortPropertyInfo
} from "../../../app.model";
import {
    displayService,
    documentService,
    referenceService,
    repoService,
    selectionService,
    userService
} from "../../../serviceComposition";
import {MenuItemVM} from "../../../framework.visual";
import {DocumentInfoVM, ObjectType, ReferenceInfoVM, SortPropertyInfoVM} from "./searchResultsModel";
import {DOCUMENT_PREVIEW_VIEW_ID} from "../systemToolbar/systemToolbarPresenter";

class SearchResultsPanel extends VisualWrapper {
    constructor() {
        super();

        this.id ='components/searchResultsPanel';

        this.metadataId = MetadataType.DOCUMENTS_GET_ARRAY;

        this.view = SearchResultsPanelView;

        this.mapStateToProps = (state: any, props: any) => {
            return {
                searchResults: this.getSearchResultVMs(state),
                resultViews: this.getResultViewVMs(state),
                selectedResultView: this.getSelectedResultViewId(state),
                sortTypes: this.getSortVMs(state),
                selectedSort: this.getSelectedSort(state),
                userLookup: userService.getActiveUsers(),
                selectedId: this.getSelectedId(state),
            };
        }

        this.mapDispatchToProps = () => {
            return {
                onDocumentSelected: (id: string, object_type: ObjectType) => this.onDocumentSelected(id, object_type),
                onResultViewSelected: (id: string) => this.onResultViewSelected(id),
                onSortSelected: (id: string) => this.onSortSelected(id)
            };
        }

        //select card view by default
        this.onResultViewSelected('cardViewId');
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
            let result = "";

            if (selectedDocumentId !== "") {
                result = selectedDocumentId;
            } else if (selectedPocketId !== "") {
                result = selectedPocketId;
            } else if (selectedReportId !== "") {
                result = selectedReportId;
            }

            return result;
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

            forEach(items, (item: any) => {

                if (item instanceof DocumentInfo) {
                    const {
                        id,
                        author="",
                        department="",
                        file_name="",
                        file_size="",
                        file_page_count="",
                        primary_sme_email="",
                        primary_sme_name="",
                        primary_sme_phone="",
                        private_tag={},
                        project="",
                        public_tag={},
                        publication_date="",
                        purpose="",
                        secondary_sme_email="",
                        secondary_sme_name="",
                        secondary_sme_phone="",
                        status="",
                        scope="",
                        title="",
                        upload_date="",
                        uploadedBy_id="",
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

                } else if (item instanceof ReportInfo) {
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

            })
            return Object.values(itemVMs);
        }
    );

    onDocumentSelected(id: string, object_type: ObjectType) {
        switch (object_type) {
            case ObjectType.DocumentInfo:
                selectionService.setContext("selected-document", id);
                selectionService.setContext("selected-pocket", '');
                selectionService.setContext("selected-report", '');
                displayService.pushNode(DocumentPanelId);
                break;
            case ObjectType.PocketInfo:
                selectionService.setContext("selected-pocket", id);
                selectionService.setContext("selected-document", '');
                selectionService.setContext("selected-report", '');
                displayService.popNode(DOCUMENT_PREVIEW_VIEW_ID)
                break;
            case ObjectType.ReportInfo:
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
        documentService.fetchDocuments();
    }
}

export const {
    connectedPresenter: SearchResultsPanelPresenter,
    componentId: SearchResultsPanelId
} = createVisualConnector(SearchResultsPanel);
