export type TooltipPortalProps = {
    portalContent?: any,
    className?: string,
    light?: boolean,
    position?: TooltipPosition;
    isButton?: boolean;
}

export type TooltipPortalState = {
    willShow?: boolean,
    isShowing?: boolean,
}

export enum TooltipPosition {
    TOP = "TOP",
    RIGHT = "RIGHT",
    BOTTOM = "BOTTOM",
    LEFT = "LEFT"
}
