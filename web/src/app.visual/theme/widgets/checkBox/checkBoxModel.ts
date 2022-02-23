export type CheckProp = {
    className?: string;
    disabled?: boolean;
    selected?: boolean;
    text?: string;
    onClick?: (selected?: boolean) => void;
    light?: boolean;
}

export interface CheckState {
    selected?: boolean;
}
