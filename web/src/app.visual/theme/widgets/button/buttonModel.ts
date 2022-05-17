import React from "react";
import {TooltipPosition} from "../tooltipPortal/tooltipPortalModel";

export enum Justify_Content {
    justify_content_start = 'justify-content-start',
    justify_content_between = 'justify-content-between',
    justify_content_around = 'justify-content-around',
    justify_content_center = 'justify-content-center',
    justify_content_end = 'justify-content-end',
}

export type ButtonProps = {
    text?: string;
    children?: any;
    justifyContent?: Justify_Content;
    orientation?: 'vertical' | 'horizontal';
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    selected?: boolean;
    disabled?: boolean;
    className?: string;
    style?: any;
    tooltip?: string;
    light?: boolean;
    highlight?: boolean;
    tooltipPosition?: TooltipPosition;
}

export type ButtonState = {

}
