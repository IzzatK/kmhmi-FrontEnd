export type SearchBoxProps = {
    text?: string,
    value?: string,
    onTextChange?: (value: string) => void,
    onSearch?: (name: string, value: string) => void,
    style?: any,
    className?: string,
    selected?: boolean,
    light?: boolean,
    placeholder?: string,
    name?: string,
}

export type SearchBoxState = {
    text: string,
    selected?: boolean;
}
