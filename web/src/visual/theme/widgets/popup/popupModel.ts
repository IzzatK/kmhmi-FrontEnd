export type PopupProps = {
    className?: string;
    isVisible?: boolean;
    onCancel?: () => void;
    onProceed?: () => void;
    text?: string;
    proceedText?: string;
    cancelText?: string;
    graphic?: any;
    padding?: string;
}

export type PopupState = {
}
