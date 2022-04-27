import {DocumentInfo, ParamType} from "../../../app.model";
import {TagItemVM} from "../../theme/widgets/tag/tagModel";

export type DocumentPanelStateProps = {
    className?: string;
    document: DocumentInfoVM;
    editProperties: Record<string, EditPropertyVM>;
    userProfile: UserProfileVM;
    token: string;
    permissions: PermissionsVM;
    pockets: Record<string, PocketVM>;
    documentHighlightAreas?: any[];
    excerpts: Record<string, ExcerptVM>;
    tagSuggestionSupplier: (text:string) => Promise<TagItemVM[]>
}

export type DocumentPanelDispatchProps = {
    onUpdateDocument: (document: DocumentUpdateParams) => void;
    onRemoveDocument: (id: string) => void;

    onCreateExcerpt: (params: CreateExcerptEventData) => void;
    onSaveNote: (note: NoteVM) => void;

    onUpdateTmpNote?: (text: string) => void;
    tmpMethod?: (text: string, highlightArea: any) => void;
    onPocketSelectionChanged?: (value: string) => void;
}

export type DocumentPanelProps = DocumentPanelStateProps & DocumentPanelDispatchProps;

export type DocumentPanelState = {
    tmpDocument: DocumentUpdateParams;
    isDirty: boolean;
    isGlobal: boolean;
    isPrivate: boolean;
    showTagEditor: boolean;
    renderTrigger: number;
    zoomScale: number;
    tmpExcerpt: Partial<CreateExcerptEventData>;
    moreInfoExpanded: boolean;
}

export type DocumentPdfPreviewProps = {
    className?: string;
    preview_url: string;
    original_url:string;
    userProfile: UserProfileVM;
    token: string;
    permissions: PermissionsVM
    tmpExcerpt: Partial<CreateExcerptEventData>;
    pockets: Record<string, PocketVM>;
    excerpts: Record<string, ExcerptVM>;
    zoomScale: number;

    onCreateExcerpt: (text: string, content: any, location: string) => void;
    onPocketSelectionChanged?: (value: string) => void;
    onUpdateTmpNote?: (text: string) => void;
    onSaveNote: (note: NoteVM) => void;
    onZoom: (zoomScale: number) => void;
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

export type CreateExcerptEventData = {
    pocketId: string;
    doc_id: string;
    note_text: string;
    note_content: string;
    excerpt_location: string;
    excerpt_text: string;
    excerpt_content: any;
}

export type ExcerptVM = {
    id?: string;
    pocketId?: string;
    noteVM: NoteVM;
    text: string;
    content: string;
    location: string;
}

export type NoteVM = {
    id: string;
    text: string;
    content: string;
}

export type DocumentUpdateParams = Partial<Record<keyof Omit<DocumentInfo, 'className'>, string>>;
