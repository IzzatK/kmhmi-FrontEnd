export type SwitchButtonProps = {
    className?: string,
    onClick?: () => void,
    selected?: boolean,
    text?: string,
}

export type SwitchButtonState = {
    selected?: boolean,
}