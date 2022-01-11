export type UploadPanelProps = {
    className: string;
    pendingFiles: Record<string, PendingDocumentVM>;
    onPendingDocumentAdded: (fileList: PendingDocumentVM[]) => void;
    onPendingDocumentRemoved: (id: string) => void;
    onDocumentSelected: (id: string) => void;
    onPendingDocumentApproved: (id: string) => void;
    onCancelUpload: (id: string) => void;
}

export type UploadPanelState = {
    showPopup: boolean;
    selectedId: string;
}

export type PendingDocumentVM = {
    id: string;
    file_name: string;
    status?: string;
    isUpdating: boolean;
    selected?: boolean;
    approved?: boolean;
    deleted?: boolean;
}
