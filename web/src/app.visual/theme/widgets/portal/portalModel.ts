import {Nullable} from "../../../../framework/extras/typeUtils";

export type PortalProps = {
    className?: string;
    isOpen?: boolean;
    onShouldClose?: (() => void) | null;
    enterClass?: string;
    exitClass?: string;
    timeout?: number;
    zIndex?: number;
    autoLayout?: boolean;
    portalContent?: any;
}

export type PortalState = {
    isOpen: boolean;
    willChangeTo: Nullable<string>;
}
