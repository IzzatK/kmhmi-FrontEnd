import {ReactNode} from "react";

export type CardProps = {
    className?: string,
    selected?: boolean,
    header?: ReactNode | undefined
    body?: ReactNode | undefined
    onClick?: () => void
    disabled?: boolean;
}

export interface CardState {
    expanded: boolean
}
