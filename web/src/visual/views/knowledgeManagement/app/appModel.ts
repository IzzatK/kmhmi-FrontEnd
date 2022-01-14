export type StateProps = {
    className?: string;
    currentSystemTool: any;
    docPreviewTool: any;
    permissions: PermissionsVM;
}
export type DispatchProps = {};

export type Props = StateProps & DispatchProps;

export type PermissionsVM = {
    canSearch: boolean;
}

export type State = {

}
