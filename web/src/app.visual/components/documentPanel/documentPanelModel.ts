import {ParamType} from "../../../app.model";

export type DocumentPanelProps = {
    className?: string;
    document: DocumentInfoVM;
    editProperties: Record<string, EditPropertyVM>;
    pdfRenderer: any;
    preview_url: string;
    original_url: string;
    userProfile: UserProfileVM;
    token: string;
    permissions: PermissionsVM;
    pockets: Record<string, PocketVM>;
    documentHighlightAreas?: any[];

    onUpdateDocument: (document: DocumentInfoVM) => void;
    onRemoveDocument: (id: string) => void;

    onSaveExcerpt: (pocketId: string, documentId: string, excerptText: string, excerptContent: string, location: string, noteText: string, noteContent: string) => void;

    onSaveNote?: (text: string) => void;

    tmpMethod?: (text: string, highlightArea: any) => void;
    onPocketSelectionChanged?: (value: string) => void;
    excerpts: Record<string, ExcerptVM>;
}

export type DocumentPanelState = {
    tmpDocument: DocumentInfoVM;
    isDirty: boolean;
    isGlobal: boolean;
    isPrivate: boolean;
    showTagEditor: boolean;
    renderTrigger: number;
    tmpExcerpt: Partial<ExcerptVM>;
}

export type DocumentPdfPreviewProps = {
    className?: string;
    preview_url: string;
    original_url:string;
    userProfile: UserProfileVM;
    token: string;
    permissions: PermissionsVM
    onSaveExcerpt?: (text: string, highlightArea: any) => void;
    tmpExcerpt: Partial<ExcerptVM>;
    pockets: Record<string, PocketVM>;
    onPocketSelectionChanged?: (value: string) => void;
    onSaveNote?: (text: string) => void;
    excerpts: Record<string, ExcerptVM>;
}

export type UserProfileVM = {
    firstName: string;
    lastName: string;
    username: string;
    id: string;
    email: string;
}

export type DocumentInfoVM = {
    [key: string]: any;
    id?: string;
    author?: string;
    department?: string;
    file_name?: string;
    file_size?: string;
    file_type?: string;
    file_page_count?: string;
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
    scope?: string;
    title?: string;
    upload_date?: string;
    uploadedBy_id?: string;
    preview_url?: string;
    original_url?: string
    isUpdating?: boolean;
    isPending?: boolean;
    nlpComplete?: boolean;
    original_private_tag?: Record<string, Record<string, string>>;
    nlpCompleteAnimation?: boolean;
    showStatusBanner?: boolean;
}

export type EditPropertyVM = {
    id: string;
    title: string;
    type: ParamType;
    long?: boolean;
    options?: any;
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

export type ExcerptVM = {
    id?: string;
    pocket?: string;
    note?: string;
    content: any;
}
