import {PocketNodeVM} from "../../../model/pocketUtils";

export type PocketsPanelProps = {
    className: string;
    data: PocketNodeVM[];
    selectionPath: string;
    addExpandedPath: (selectionPath: string) => void;
    removeExpandedPath: (selectionPath: string) => void;
    onCreatePocket: (title: string) => void;
    onDownloadDocument: (id: string) => void;
    onRemoveDocument: (id: string) => void;
    onDownloadPocket: (id: string) => void;
}

export type PocketsPanelState = {
}

export type NodeRendererProps = {
    id: string;
    path: string;
    className?: string;
    title?: string;
}

export type PocketNodeRendererProps = NodeRendererProps &
    {
        onShare: (id: string) => void;
        onDownload: (id: string) => void;
        onSettings: (id: string) => void;
    }

export type ResourceNodeRendererProps = NodeRendererProps &
    {
        onDownload: (id: string) => void;
        onRemove: (id: string) => void;
    }

export type PocketNodeRendererState = {

}
