export type FileInputProps = {
    className?: string;
    onSelected?: (files: any) => void;
    selected?: any;//TODO find right type
}

export type FileInputState = {
    isDragging: boolean;
}
