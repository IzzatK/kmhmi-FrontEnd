export type TreeViewProps = {
    className?: string;
    rootNodes?: TreeNodeVM[];
    onSelected?: (node: any) => void;
    onToggle?: (node: any) => void;
    selectionPaths?: string[];
    cellContentRenderer?: any;
    index?: number;
    selected?: boolean;
}


export type TreeNodeProps = {
    className?: string;
    onSelected?: (node: any) => void;
    onToggle?: (node: any) => void;
    selectionPaths?: string[];
    cellContentRenderer?: any;
    node: TreeNodeVM;
    index?: number;
    selected?: boolean;
}

export type TreeNodeState = {
    expanded: boolean;
}

export type TreeNodeVM = {
    id: string;
    name: string,
    path: string,
    childNodes: TreeNodeVM[]
}
