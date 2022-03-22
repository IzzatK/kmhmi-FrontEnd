import {PocketNodeType} from "../../../model/pocketNodeType";
import {PocketInfo} from "../../../../app.model";

export type PocketsPanelStateProps = {
    className?: string;
    data: PocketNodeVM[];
    selectionPath: string;
    expandedPaths: string[];
}

export type PocketsPanelDispatchProps = {
    onPocketItemSelected: (id: string) => void;
    onPocketItemToggle: (id: string, expanded: boolean) => void;
    onCreatePocket: (title: string) => void;
    onUpdatePocket: (edits: PocketUpdateParams) => void;
    onDownloadDocument: (id: string) => void;
    onDownloadPocket: (id: string) => void;
    onRemoveNote: (id: string) => void;
    onRemoveExcerpt: (id: string) => void;
    onRemoveResource: (id: string) => void;
}

export type PocketsPanelProps = PocketsPanelStateProps & PocketsPanelDispatchProps;

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
        onSave: (edits: PocketUpdateParams) => void;
    }

export type ResourceNodeRendererProps = NodeRendererProps &
    {
        onDownload: (id: string) => void;
        onRemove: (id: string) => void;
    }

export type ExcerptNodeRendererProps = NodeRendererProps &
    {
        onRemove: (id: string) => void;
    }

export type NoteNodeRendererProps = NodeRendererProps &
    {
        onRemove: (id: string) => void;
    }

export type PocketNodeRendererState = {
    tab: PocketTabType,
    edits: PocketUpdateParams
}

export type PocketUpdateParams = Partial<Record<keyof Omit<PocketInfo, 'type' | 'childNodes' | 'path'>, string>>;

export enum PocketTabType {
    NONE,
    SHARE,
    DOWNLOAD,
    SETTINGS
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
