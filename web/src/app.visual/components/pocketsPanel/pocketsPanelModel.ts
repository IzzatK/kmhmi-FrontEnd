import {PocketNodeType} from "../../model/pocketNodeType";
import {NoteInfo, PocketInfo} from "../../../app.model";
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
    onPocketItemSelected: (pocket_id: string) => void;
    onPocketItemToggle: (id: string, expanded: boolean, type?: string) => void;
    onReportItemSelected: (report_id: string) => void;
    onResourceItemSelected: (resource_id: string) => void;

    onSearchTextChanged: (value: string) => void;
    onSearch: () => void;

    onCreatePocket: (title: string) => void;
    onUpdatePocket: (edits: PocketUpdateParams) => void;
    onDownloadPocket: (pocket_id: string) => void;
    onDeletePocket: (pocket_id: string) => void;

    onDeleteResource: (resource_id: string, pocket_id: string) => void;
    onDownloadResource: (resource_id: string) => void;

    onDeleteExcerpt: (excerpt_id: string, pocket_id: string) => void;
    onAddExcerptToReport: (event: React.DragEvent<HTMLDivElement>, id: string, resource_id: string) => void;

    onDeleteNoteFromExcerpt: (note_id: string, pocket_id: string) => void;
    onDeleteNoteFromResource: (note_id: string, pocket_id: string) => void;
    onDeleteNoteFromPocket: (note_id: string, pocket_id: string) => void;

    onCreateReport: (pocket_id: string) => void;
    onDeleteReport: (report_id: string, pocket_id: string) => void;

    onAddNote: (noteVM: NoteVM) => void;
}

export type PocketsPanelPresenterProps = PocketsPanelAppStateProps & PocketsPanelAppDispatchProps;

export type PocketsPanelPresenterState = {
    selectedNode: any;
    editPocketId: string;
    editNoteId: string;
}

export type PocketsPanelViewProps = {
    className: string;
    selectionPath: string;
    expandedPaths: string[];
    data: PocketNodeVM[];
    selectedNode: any;

    cellContentRenderer: (node: PocketNodeVM) => JSX.Element;
    onNodeToggle: (nodeVM: any, expanded: boolean) => void;
    onNodeSelected: (nodeVM: any) => void;


    onCreatePocket: () => void;
    onEditPocket: (pocket_id: string) => void;
    onDeletePocket: (pocket_id: string) => void;

    onCreateReport: (pocket_id: string) => void;
    onDeleteReport: (report_id: string, pocket_id: string) => void;

    onDownloadResource: (resource_id: string) => void;
    onDeleteResource: (resource_id: string, pocket_id: string) => void;


    onDeleteExcerpt: (excerpt_id: string, pocket_id: string) => void;

    onDeleteNote: (note_id: string, pocket_id: string, resource_id?: string, excerpt_id?: string) => void;
    onEditNote: (note_id: string, pocket_id: string, resource_id?: string, excerpt_id?: string) => void;

    onAddNoteToExcerpt: (excerpt_id: string, resource_id: string, pocket_id: string) => void;
    onAddNoteToResource: (resource_id: string, pocket_id: string) => void;
    onAddNoteToPocket: (pocket_id: string) => void;
}

export type NodeRendererProps = {
    id: string;
    path: string;
    selected: boolean;

    className?: string;
    isUpdating?: boolean;
    title?: string;
    resource_id?: string;
    excerpt_id?: string;
    pocket_id: string;
}

export type PocketNodeRendererProps = NodeRendererProps & {
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

export type ResourceNodeRendererProps = NodeRendererProps & {
    onDownload: (id: string) => void;
    onRemove: (id: string) => void;
}

export type ReportNodeRendererProps = NodeRendererProps & {
    onDownload: (id: string) => void;
    onRemove: (id: string) => void;
}

export type ExcerptNodeRendererProps = NodeRendererProps & {
    onRemove: (id: string) => void;
    onAddExcerptToReport: (event: React.DragEvent<HTMLDivElement>, id: string) => void;
}

export type NoteNodeRendererProps = NodeRendererProps & {
    onRemove: (id: string) => void;
    onSave: (note: NoteVM) => void;
    isEdit: boolean;
}

export type NoteNodeRenderState = {
    edits: NoteUpdateParams
}

export type PocketNodeRendererState = {
    tab: PocketTabType,
    edits: PocketUpdateParams
}

export type NoteUpdateParams = Partial<Record<keyof Omit<NoteInfo, 'type' | 'childNodes' | 'path'>, string>>

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
    excerpt_id?: string;
    isUpdating: boolean,
    selected: boolean;
    source_id?: string;
}

export type PocketSliceState = {
    expandedPaths: string[]
}

export type PocketCaseReducers =  {
    addExpandedPath: (state: PocketSliceState, action: PayloadAction<string>) => void;
    removeExpandedPath: (state:PocketSliceState, action:PayloadAction<string>) => void;
};

export type NoteVM = {
    id: string;
    text: string;
    content: string;
    excerpt_id?: string;
    resource_id?: string;
    pocket_id: string;
}
