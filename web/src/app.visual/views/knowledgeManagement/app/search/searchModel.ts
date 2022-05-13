export type Props = {
    className: string;
    toolsVisible: boolean;
    permissions: PermissionsVM;
}

export type State = {}

export type PermissionsVM = {
    canSearch: boolean;
    isAuthorizing: boolean;
}
