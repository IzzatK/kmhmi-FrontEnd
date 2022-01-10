export type TextEditProps = {
    className?: string;
    value?: string;
    dirty?: boolean;
    placeholder?: string;
    disable?: boolean;
    type?: "date" | "datetime-local" | "email" | "month" | "number" | "password" | "range" | "search" | "submit" | "text" | "time" | "url" | "week";
    onCancel?: () => void;
    onChange?: (value: string) => void;
    name?: string;
    onSubmit?: (name: string, value: string) => void;
    onKeyUp?: () => void;
    edit?: boolean;
    autoFocus?: boolean;
    rows?: number;
    cols?: number;
}

export type TextEditState = {
    tmpValue: string;
    tooltipId: string;
    isHover: boolean;
    cancelHover: boolean;
}
