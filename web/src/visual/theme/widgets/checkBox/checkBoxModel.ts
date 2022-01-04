export type CheckProp = {
    className?: string;
    disabled?: boolean;
    selected?: boolean;
    text?: string;
    onClick?: () => void;
}

export interface CheckState {
    selected?: boolean;
}
