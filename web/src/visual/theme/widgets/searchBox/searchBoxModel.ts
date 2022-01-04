export type SearchBoxProps = {
    text?: string,
    value?: string,
    onTextChange?: (value: string) => void,
    onSearch?: () => void,
    style?: any,
    className?: string,
}

export type SearchBoxState = {
    text?: string,
}
