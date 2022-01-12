export type CheckProp = {
    className?: string;
    disabled?: boolean;
    selected?: boolean;
    text?: string;
    onClick?: (selected?: boolean) => void;
}

export interface CheckState {
    selected?: boolean;
}
