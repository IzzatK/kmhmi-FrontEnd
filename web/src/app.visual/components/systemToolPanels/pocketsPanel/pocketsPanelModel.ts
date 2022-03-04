import {ReactNode} from "react";
import {Nullable} from "../../../../framework.core/extras/typeUtils";

export type PocketsPanelProps = {
    className: string;
    data: any;
}

export type PocketsPanelState = {
}

export type PocketNodeProps = {
    className: string;
    title: string;
    subTitle: string;
    actions: Nullable<ReactNode>;
}

export type PocketNodeState = {
    selected: boolean;
}
