enum Classification {
    UNCLASSIFIED
}

export type SystemBannerProps = {
    className: string;
    onReturnHome: () => void;
    onLogout: () => void;
    userName: string;
    classification: Classification;
    role: string;
    isLoggedIn: boolean;
}

export type SystemBannerState = {
}

export type RoleVM = {
    id: string;
    title: string;
}
