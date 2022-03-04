import {ReactNode} from "react";
import {Nullable} from "../../../../framework.core/extras/typeUtils";

export type PocketsPanelProps = {
    className: string;
    data: any;
    addSelectionPath: (selectionPath: string) => void;
    removeSelectionPath: (selectionPath: string) => void;
}

export type PocketsPanelState = {
}

export type PocketNodeProps = {
    id: string;
    path: string;
    className: string;
    title: string;
    subTitle: string;
    actions: Nullable<ReactNode>;
    onSelect: (id: string, selected: boolean) => void;
    selected?: boolean;
}

export type PocketNodeState = {
    selected: boolean;
}
