export type StateProps = {
    className?: string;
    currentSystemTool: any;
    isDocumentVisible: any;
    isReportVisible: any;
    isHelpVisible: any;
    permissions: PermissionsVM;
    isAuthorizing: boolean;
    isAuthorized: boolean;
}
export type DispatchProps = {};

export type Props = StateProps & DispatchProps;

export type AppState = {
    isMouseDown: boolean;
    mousePosition: number;
    documentPreviewPanelWidth: string;
    movementDirection: number;
}

export type PermissionsVM = {
    canSearch: boolean;
    isAuthorizing: boolean;
}

export type UserInfoVM = {
    [key: string]: any;
    name?: string;
    email?: string;
    phone?: string;
}

export type State = {

}
