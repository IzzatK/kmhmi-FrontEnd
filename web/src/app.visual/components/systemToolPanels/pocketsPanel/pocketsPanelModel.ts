import {PocketNodeType} from "../../../model/pocketNodeType";


export type PocketsPanelProps = {
    className: string;
    data: PocketNodeVM[];
    selectionPath: string;
    onPocketItemSelected: (id: string) => void;
    onPocketItemToggle: (id: string, expanded: boolean) => void;
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

export type PocketNodeVM = {
    id: string,
    path: string,
    title: string,
    content: string,
    type: PocketNodeType
    // expanded: boolean,
    // selected: boolean,
    childNodes: PocketNodeVM[],
}
