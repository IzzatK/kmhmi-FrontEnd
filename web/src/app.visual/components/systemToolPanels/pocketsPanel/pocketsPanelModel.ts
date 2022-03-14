import {ReactNode} from "react";
import {Nullable} from "../../../../framework.core/extras/typeUtils";

export type PocketsPanelProps = {
    className: string;
    data: any;
    addSelectionPath: (selectionPath: string) => void;
    removeSelectionPath: (selectionPath: string) => void;
    selectionPaths: string[];
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
    onSelect?: (id: string, selected?: boolean) => void;
    selected?: boolean;
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
