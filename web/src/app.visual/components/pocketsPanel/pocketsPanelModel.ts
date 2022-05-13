import {PocketNodeType} from "../../model/pocketNodeType";
import {PocketInfo} from "../../../app.model";
import React from "react";
import {PayloadAction} from "@reduxjs/toolkit";

export type PocketsPanelAppStateProps = {
    className?: string;
    data: PocketNodeVM[];
    selectionPath: string;
    expandedPaths: string[];
    searchText: string;
}

export type PocketsPanelAppDispatchProps = {
    onPocketItemSelected: (id: string) => void;
    onPocketItemToggle: (id: string, expanded: boolean, type?: string) => void;
    onCreatePocket: (title: string) => void;
    onUpdatePocket: (edits: PocketUpdateParams) => void;
    onDownloadDocument: (id: string) => void;
    onDownloadPocket: (id: string) => void;
    onRemoveNote: (id: string, pocket_id: string) => void;
    onRemoveExcerpt: (id: string, pocket_id: string) => void;
    onRemoveResource: (id: string, pocket_id: string) => void;
    onAddExcerptToReport: (event: React.DragEvent<HTMLDivElement>, id: string, resource_id: string) => void;
    onSearchTextChanged: (value: string) => void;
    onSearch: () => void;
    onDelete: (id: string) => void;
    onCreateReport: (id: string) => void;
    onRemoveReport: (id: string, pocket_id: string) => void;
    onReportItemSelected: (id: string) => void;
    onDocumentItemSelected: (id: string) => void;
    onAddNote: () => void;
}

export type PocketsPanelPresenterProps = PocketsPanelAppStateProps & PocketsPanelAppDispatchProps;

export type PocketsPanelPresenterState = {
    selectedNode: any;
    editPocketId: string;
}

export type PocketsPanelViewProps = {
    className: string;
    data: PocketNodeVM[];
    selectionPath: string;
    expandedPaths: string[];
    selectedNode: any;
    onCreatePocket: (title: string) => void;
    cellContentRenderer: (node: PocketNodeVM) => JSX.Element;
    onNodeToggle: (nodeVM: any, expanded: boolean) => void;
    onNodeSelected: (nodeVM: any) => void;
    onCreateReport: (id: string, pocket_id: string) => void;
    onEditPocket: (id: string) => void;
    onDeletePocket: (id: string) => void;
    onDownloadDocument: (id: string) => void;
    onRemoveResource: (id: string, pocket_id: string) => void;
    onRemoveExcerpt: (id: string, pocket_id: string) => void;
    onRemoveNote: (id: string, pocket_id: string) => void;
    onAddNote: (id: string, pocket_id: string) => void;
    onRemoveReport: (id: string, pocket_id: string) => void;
}

export type NodeRendererProps = {
    id: string;
    path: string;
    className?: string;
    title?: string;
    isUpdating?: boolean;
    selected: boolean;
}

export type PocketNodeRendererProps = NodeRendererProps &
    {
        onShare: (id: string) => void;
        onDownload: (id: string) => void;
        onSave: (edits: PocketUpdateParams) => void;
        onSearchTextChanged: (value: string) => void;
        onSearch: () => void;
        searchText: string;
        onDelete: () => void;
        onCreateReport: () => void;
        isEdit: boolean;
    }

export type ResourceNodeRendererProps = NodeRendererProps &
    {
        onDownload: (id: string) => void;
        onRemove: (id: string) => void;
    }

export type ReportNodeRendererProps = NodeRendererProps &
    {
        onDownload: (id: string) => void;
        onRemove: (id: string) => void;
    }

export type ExcerptNodeRendererProps = NodeRendererProps &
    {
        onRemove: (id: string) => void;
        onAddExcerptToReport: (event: React.DragEvent<HTMLDivElement>, id: string) => void;
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
    EDIT,
}

export type PocketNodeVM = {
    id: string,
    path: string,
    title: string,
    content: string,
    type: PocketNodeType,
    childNodes: PocketNodeVM[],
    pocket_id: string,
    resource_id?: string;
    isUpdating: boolean,
    selected: boolean;
}

export type PocketSliceState = {
    expandedPaths: string[]
}

export type PocketCaseReducers =  {
    addExpandedPath: (state: PocketSliceState, action: PayloadAction<string>) => void;
    removeExpandedPath: (state:PocketSliceState, action:PayloadAction<string>) => void;
};
