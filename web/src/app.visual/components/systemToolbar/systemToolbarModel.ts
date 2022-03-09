import {Component} from "react";

export type SystemToolbarProps = {
    className: string;
    tools: SystemToolVM[];
    onToolSelected: (id: string) => void;
    documentPreviewTool: SystemToolVM;
    reportTool: SystemToolVM;
    onDocumentPreviewSelected: () => void;
    onReportSelected: () => void;
}

export type SystemToolbarState = {
}

export type SystemToolVM = {
    id: string,
    selected?: boolean,
    title?: string,
    graphic: {new(props: {className: string}, context: any): Component<{className: string}, any>}
}
