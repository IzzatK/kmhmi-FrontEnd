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
    readonly?: boolean;
    selectedItemIds?: string[];
}

export type ComboBoxState = {
    selected: boolean;
    selectedItemIds: string[];
}

export type ComboBoxItemProps = {
    className?: string;
    style?: object;
    id?: string;
    title?: string;
    onClick?: (() => void) | undefined;
    selected?: boolean;
    multiSelect?: boolean;
    readonly?: boolean;
}

export type ComboBoxItemState = {

}
