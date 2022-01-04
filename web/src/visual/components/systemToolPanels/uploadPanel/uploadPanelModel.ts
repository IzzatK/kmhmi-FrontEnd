export type UploadPanelProps = {
    className: string;
    pendingFiles: Record<string, PendingDocumentVM>;
    onPendingDocumentAdded: (fileList: PendingDocumentVM[]) => void;
    onPendingDocumentRemoved: (id: string) => void;
    onDocumentSelected: (id: string) => void;
}

export type UploadPanelState = {
    lastSelected: any;
}

export type PendingDocumentVM = {
    id: string;
    file_name: string;
    status?: string;
    isUpdating: boolean;
    selected?: boolean;
}
