export type SearchBoxProps = {
    text?: string,
    value?: string,
    onTextChange?: (value: string) => void,
    onSearch?: () => void,
    style?: any,
    className?: string,
    selected?: boolean,
    light?: boolean,
    placeholder?: string,
}

export type SearchBoxState = {
    text?: string,
    selected?: boolean;
}
