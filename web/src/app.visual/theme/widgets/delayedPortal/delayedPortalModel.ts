import {ReactNode} from "react";
import {Nullable} from "../../../../framework.core/extras/utils/typeUtils";

export type DelayedPortalProps = {
    isOpen: boolean;
    openDelay?: number;
    closeDelay?: number;
    children: (isOpen: boolean, willOpen: boolean, willClose: boolean) => ReactNode
}


export type DelayedPortalState = {
    isOpen: boolean;
    willChangeTo: Nullable<string>
}
