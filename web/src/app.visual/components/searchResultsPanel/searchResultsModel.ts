import {MenuItemVM} from "../../../framework.visual/model/menuItemVM";
import {MetaDataVM} from "../../../framework.visual/model/metaDataVM";
import {Nullable} from "../../../framework/extras/typeUtils";
import {ReferenceType, UserInfo} from "../../../app.model";

export type SearchResultsStateProps = {
    className: string;
    searchResults: DocumentInfoVM[];
    resultViews: Record<string, MenuItemVM>;
    selectedResultView: string;
    sortTypes: SortPropertyInfoVM[];
    selectedSort: SortPropertyInfoVM;
    pageWidth?: PageWidth;
    userLookup?: Record<string, UserInfo>;
}

export type SearchResultsDispatchProps = {
    onDocumentSelected: (id: Nullable<string>) => void;
    onResultViewSelected: (id: string) => void;
    onSortSelected: (id: Nullable<string>) => void;
}

export type SearchResultsProps = SearchResultsStateProps & SearchResultsDispatchProps & MetaDataVM;

export enum PageWidth {
    FULL='FULL',
    ONE_HALF='ONE_HALF',
    ONE_THIRD='ONE_THIRD',
}

export type SearchResultsState = {
    pageWidth?: PageWidth;
    columns?: any[];
    renderTrigger: number;
}

export type ReferenceInfoVM = {
    id: string;
    title: string;
    type: ReferenceType;
    className: string;
}

export type DocumentInfoVM = {
    [key: string]: any;
    id: string;
    author?: string;
    department?: string;
    file_name?: string;
    file_size?: string;
    type?: string;
    page_count?: string;
    primary_sme_email?: string;
    primary_sme_name?: string;
    primary_sme_phone?: string;
    private_tag?: Record<string, string>,
    project?: string,
    public_tag?: Record<string, string>,
    publication_date?: string,
    purpose?: string;
    secondary_sme_email?: string;
    secondary_sme_name?: string;
    secondary_sme_phone?: string;
    status?: string;
    title?: string;
    timestamp?: string;
    uploadedBy_id?: string;
    preview_url?: string;
    original_url?: string
    isUpdating?: boolean;
    isPending?: boolean;
    selected?: boolean;
}

export type SortPropertyInfoVM = {
    id?: string;
    title?: Nullable<string>;
    value?: Nullable<any>;
    selected?: boolean;
}
