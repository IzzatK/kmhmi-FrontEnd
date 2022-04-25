import {MenuItemVM} from "../../../framework.visual";
import {MetaDataVM} from "../../../framework.visual";
import {Nullable} from "../../../framework.core/extras/utils/typeUtils";
import {ReferenceType, UserInfo} from "../../../app.model";

export type SearchResultsStateProps = {
    className?: string;
    searchResults: DocumentInfoVM[];
    resultViews: Record<string, MenuItemVM>;
    selectedResultView: string;
    sortTypes: SortPropertyInfoVM[];
    selectedSort: SortPropertyInfoVM;
    userLookup?: Record<string, UserInfo>;
    selectedId?: string;
}

export type SearchResultsDispatchProps = {
    onDocumentSelected: (id: Nullable<string>, object_type: ObjectType) => void;
    onResultViewSelected: (id: string) => void;
    onSortSelected: (id: Nullable<string>) => void;
}

export type SearchResultsProps = SearchResultsStateProps & SearchResultsDispatchProps & MetaDataVM;

export type SearchResultsState = {
    pageWidth: PageWidth;
}

export type ResultsRendererProps = {
    className?: string;
    pageWidth: PageWidth;
    searchResults: DocumentInfoVM[];
    onDocumentSelected: (id: Nullable<string>, object_type: ObjectType) => void;
}

export type CardCollectionRendererProps = ResultsRendererProps &
    {

    }

export type ListCollectionRendererProps = ResultsRendererProps &
    {
        userLookup?: Record<string, UserInfo>;
    }

export type TableCollectionRendererProps = ResultsRendererProps &
    {

    }

export type ResultsRendererState = {
    renderTrigger: number;
}

export type CardCollectionRendererState = ResultsRendererState &
    {

    }

export type ListCollectionRendererState = ResultsRendererState &
    {

    }

export type TableCollectionRendererState = ResultsRendererState &
    {
        columnWidths: string[];
    }

export enum PageWidth {
    FULL='FULL',
    ONE_HALF='ONE_HALF',
    ONE_THIRD='ONE_THIRD',
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
    upload_date?: string;
    uploadedBy_id?: string;
    preview_url?: string;
    original_url?: string
    isUpdating?: boolean;
    isPending?: boolean;
    selected?: boolean;
    object_type: ObjectType;
}

export enum ObjectType {
    DocumentInfo,
    PocketInfo,
    ReportInfo
}

export type SortPropertyInfoVM = {
    id?: string;
    title?: Nullable<string>;
    value?: Nullable<any>;
    selected?: boolean;
}
