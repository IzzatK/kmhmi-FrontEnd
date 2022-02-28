export type TreeViewProps = {
    className?: string;
    data?: any;
    onSelected?: (node: any) => void;
    selectionPath?: any;
    cellContentRenderer?: any;
    node?: any;
    index?: number;
    selected?: boolean;
}

export type TreeViewState = {
    expanded: boolean;
}
