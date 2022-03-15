import React from "react";

export type TreeViewProps = {
    className?: string;
    rootNodes?: TreeNodeVM[];
    onSelected?: (node: TreeNodeVM) => void;
    onToggle?: (node: TreeNodeVM, nextExpanded: boolean) => void;
    selectionPath?: string;
    expandedPaths?: string[];
    cellContentRenderer: (node: any) => JSX.Element;
    index?: number;
    selected?: boolean;
}

export type TreeViewState = {
}


export type TreeNodeProps = {
    className?: string;
    onSelected?: (node: any) => void;
    onToggle?: (node: TreeNodeVM, nextExpanded: boolean) => void;
    selectionPath?: string;
    expandedPaths?: string[];
    cellContentRenderer: (node: any) => JSX.Element;
    index?: number;
    node: TreeNodeVM;
}

export type TreeNodeState = {
    expanded: boolean;
}

export type TreeNodeVM = {
    id: string;
    title: string,
    content: string,
    path: string,
    childNodes: TreeNodeVM[],
    selected?: boolean;
    expanded?: boolean;
}
