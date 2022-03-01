export type ContextMenuProps = {
    className?: string;
    targetId: string;
    options?: string[];
    parentWidth?: number;
    parentHeight?: number;
}

export type ContextMenuState = {
    visible: boolean;
    posX: number;
    posY: number;
}
