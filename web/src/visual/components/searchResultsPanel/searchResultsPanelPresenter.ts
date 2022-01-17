import {createSelector} from "@reduxjs/toolkit";
import SearchResultsPanelView from "./searchResultsPanelView";
import {Presenter} from "../../../framework.visual/extras/presenter";
import {createComponentWrapper} from "../../../framework/wrappers/componentWrapper";
import {forEach, forEachKVP} from "../../../framework.visual/extras/utils/collectionUtils";
import {DocumentPanelId} from "../documentPanel/documentPanelPresenter";
import {DocumentInfo, MetadataType, ReferenceInfo, ReferenceType, SortPropertyInfo} from "../../../model";
import {
    displayService,
    documentService,
    referenceService,
    repoService,
    selectionService, userService
} from "../../../application/serviceComposition";
import {SearchResultsMenuItem} from "../../model/searchResultsMenuItem";
import {MenuItemVM} from "../../../framework.visual/model/menuItemVM";
import {DocumentInfoVM, ReferenceInfoVM, SortPropertyInfoVM} from "./searchResultsModel";

class SearchResultsPanel extends Presenter {
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
            };
        }

        this.mapDispatchToProps = () => {
            return {
                onDocumentSelected: (id: string) => this.onDocumentSelected(id),
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

    getSearchResultVMs = createSelector(
        [documentService.getSearchDocuments, this.getSelectedDocumentId, this.getDepartmentVMs, this.getStatusVMs, this.getPurposeVMs],
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

            forEach(items, (item: DocumentInfo) => {
                const {
                    id,
                    author="",
                    department="",
                    file_name="",
                    file_size="",
                    file_type="",
                    file_page_count="",
                    primary_sme_email="",
                    primary_sme_name="",
                    primary_sme_phone="",
                    private_tag=[],
                    project="",
                    public_tag=[],
                    publication_date="",
                    purpose="",
                    secondary_sme_email="",
                    secondary_sme_name="",
                    secondary_sme_phone="",
                    status="",
                    title="",
                    upload_date="",
                    uploadedBy_id="",
                    preview_url="",
                    original_url="",
                    isUpdating,
                } = item;

                itemVMs[item.id] = {
                    id: id,
                    author: author,
                    department: departmentVMs[department] ? departmentVMs[department].title : department,
                    file_name: title ? file_name : undefined,
                    file_size: file_size,
                    // type: file_type,
                    page_count: file_page_count,
                    primary_sme_email: primary_sme_email ? primary_sme_email : "N/A",
                    primary_sme_name: primary_sme_name ? primary_sme_name : "N/A",
                    primary_sme_phone: primary_sme_phone ? primary_sme_email : "N/A",
                    private_tag: private_tag,
                    project: project,
                    public_tag: public_tag,
                    publication_date: publication_date ? new Date(publication_date).toLocaleString() : 'No Publication Date',
                    purpose: purposeVMs[purpose] ? purposeVMs[purpose].title : purpose,
                    secondary_sme_email: secondary_sme_email ? secondary_sme_email : "N/A",
                    secondary_sme_name: secondary_sme_name ? secondary_sme_name : "N/A",
                    secondary_sme_phone: secondary_sme_phone ? secondary_sme_phone : "N/A",
                    status: statusVMs[status] ? statusVMs[status].title : status,
                    title: title ? title : file_name,
                    timestamp: upload_date ? new Date(upload_date).toLocaleString() : 'No Upload Date',
                    uploadedBy_id: uploadedBy_id,
                    selected: id === selectedId,
                    isUpdating: isUpdating,
                };

            })
            return Object.values(itemVMs);
        }
    );

    onDocumentSelected(id: string) {
        selectionService.setContext("selected-document", id);
        displayService.showNode(DocumentPanelId);
    }

    getResultViews = () => {
        return repoService.getAll<SearchResultsMenuItem>(SearchResultsMenuItem.class);
    }

    getSelectedResultViewId = selectionService.makeGetContext("search-panel-result-view");

    getResultViewVMs = createSelector(
        [this.getResultViews, this.getSelectedResultViewId],
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
} = createComponentWrapper(SearchResultsPanel);
