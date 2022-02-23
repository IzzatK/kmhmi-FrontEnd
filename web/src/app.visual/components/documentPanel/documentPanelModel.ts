import {ParamType} from "../../../app.model";

export type DocumentPanelProps = {
    className: string;
    document: DocumentInfoVM;
    onUpdateDocument: (document: DocumentInfoVM) => void;
    onRemoveDocument: (id: string) => void;
    editProperties: Record<string, EditPropertyVM>;
    pdfRenderer: any;
    preview_url: string;
    original_url: string;
    userProfile: UserProfileVM;
    token: string;
    permissions: PermissionsVM;
    nlpCompleteAnimation?: boolean;
}

export type DocumentPanelState = {
    tmpDocument: DocumentInfoVM;
    isDirty: boolean;
    isGlobal: boolean;
    isPrivate: boolean;
    showTagEditor: boolean;
    showStatusBanner: boolean;
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
