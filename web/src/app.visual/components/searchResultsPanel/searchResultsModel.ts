import {MenuItemVM} from "../../../framework.visual";
import {MetaDataVM} from "../../../framework.visual";
import {Nullable} from "../../../framework.core/extras/utils/typeUtils";
import {ReferenceType, UserInfo} from "../../../app.model";

export type SearchResultsPanelAppStateProps = {
    className?: string;
    searchResults: DocumentInfoVM[];
    resultViews: Record<string, MenuItemVM>;
    selectedResultView: string;
    sortTypes: SortPropertyInfoVM[];
    selectedSort: Nullable<SortPropertyInfoVM>;
    userLookup?: Record<string, UserInfo>;
    selectedDocument?: DocumentInfoVM | undefined;
    permissions: PermissionsVM;
    pockets: Record<string, PocketVM>;
}

export type SearchResultsPanelAppDispatchProps = {
    onDocumentSelected: (id: string, object_type: ObjectType) => void;
    onResultViewSelected: (id: string) => void;
    onSortSelected: (id: string) => void;
    onDownload: (id: string, object_type: ObjectType) => void;
    onDelete: (id: string, object_type: ObjectType) => void;
    onAddToPocket: (id: string, object_type: ObjectType, pocketId: string) => void;
}

export type SearchResultsPanelPresenterProps = SearchResultsPanelAppStateProps & SearchResultsPanelAppDispatchProps & MetaDataVM;

export type SearchResultsPanelPresenterState = {
    pageWidth: PageWidth;
}

export type SearchResultsPanelViewProps = {
    className?: string;
    searchResults: DocumentInfoVM[];
    resultViews: Record<string, MenuItemVM>;
    selectedResultView: string;
    sortTypes: SortPropertyInfoVM[];
    selectedSort: Nullable<SortPropertyInfoVM>;
    userLookup?: Record<string, UserInfo>;
    selectedDocument?: DocumentInfoVM;
    isLoading?: boolean;
    hasError?: boolean;
    errorMessage?: string;
    pageWidth: PageWidth;
    permissions: PermissionsVM;
    pockets: Record<string, PocketVM>;
    onDocumentSelected: (id: string, object_type: ObjectType) => void;
    onResultViewSelected: (id: string) => void;
    onSortSelected: (id: string) => void;
    onDownload: (id: string, object_type: ObjectType) => void;
    onCopy: (id: string, object_type: ObjectType) => void;
    onEdit: (id: string, object_type: ObjectType) => void;
    onShare: (id: string, object_type: ObjectType) => void;
    onDelete: (id: string, object_type: ObjectType) => void;
    onAddToPocket: (id: string, object_type: ObjectType, pocketId: string) => void;
}

export type SearchResultsPanelViewState = {
    showAddToPocket: boolean;
}

export type ResultsRendererProps = {
    className?: string;
    pageWidth: PageWidth;
    searchResults: DocumentInfoVM[];
    onDocumentSelected: (id: Nullable<string>, object_type: ObjectType) => void;
    userLookup?: Record<string, UserInfo>;
}

export type ResultsRendererState = {
    renderTrigger: number;
}

export type CardCollectionRendererProps = ResultsRendererProps &
    {

    }

export type ListCollectionRendererProps = ResultsRendererProps &
    {

    }

export type TableCollectionRendererProps = ResultsRendererProps &
    {

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
    scope?: string;
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

export type PermissionsVM = {
    canDelete: boolean,
    canDownload: boolean,
    canModify: boolean
}

export type PocketVM = {
    id: string;
    title: string;
}
