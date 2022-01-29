enum Classification {
    UNCLASSIFIED
}

export type SystemBannerProps = {
    className: string;
    onReturnHome: () => void;
    onLogout: () => void;
    userName: string;
    classification: Classification;
}

export type SystemBannerState = {
}
