import {Component} from "react";

export type ToolbarProps = {
    className?: string,
    tools: ToolItemProps[],
    onToolSelected?: (id: any) => void,
    orientation?: "vertical" | "horizontal",
    id?: string,
    graphic?: () => void,
    onClick?: () => void,
    selected?: boolean,
    onToolClick?: (tool: any) => void,
}

export type ToolItemProps = {
    id: string;
    selected?: boolean;
    title?: string;
    graphic: {new(props: {className: string}, context: any): Component<{className: string}, any>};
}
