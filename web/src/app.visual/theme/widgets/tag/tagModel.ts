export type TagProps = {
    className?: string;
    name: string;
    text: string;
    onDelete?: (name: string, text: string) => void;
    onSubmit?: (name: string, text: string, tmpValue: string) => void;
    isEdit?: boolean;
    isGlobal?: boolean;
    readonly?: boolean;
}

export type TagState = {
    selected: boolean;
    tmpText: string;
}
