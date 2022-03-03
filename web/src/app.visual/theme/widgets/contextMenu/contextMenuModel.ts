export type ContextMenuProps = {
    className?: string;
    targetId: string;
    parentWidth?: number;
    parentHeight?: number;
}

export type ContextMenuState = {
    visible: boolean;
    posX: number;
    posY: number;
}
