export type ComboBoxProps = {
    className?: string;
    id?: string;
    title?: string;
    onSelect?: (id: any) => void;
    items?: object;
    graphic?: any;
    disable?: boolean;
    onClick?: (() => void) | undefined;
    style?: any;
    selected?: boolean;
    light?: boolean;
    dirty?: boolean;
    multiSelect?: boolean;
}

export type ComboBoxState = {
    selected: boolean;
    selectedItemIds: Record<string, string>;
}

export type ComboBoxItemProps = {
    className?: string;
    id?: string;
    title?: string;
    onClick?: (() => void) | undefined;
    selected?: boolean;
    multiSelect?: boolean;
}

export type ComboBoxItemState = {

}
