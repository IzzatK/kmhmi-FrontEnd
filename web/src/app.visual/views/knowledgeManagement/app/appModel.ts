import {Nullable} from "../../../../framework/extras/typeUtils";

export type StateProps = {
    className?: string;
    currentSystemTool: any;
    isDocumentVisible: any;
    permissions: PermissionsVM;
    hasAccess: boolean;
}
export type DispatchProps = {};

export type Props = StateProps & DispatchProps;

export type PermissionsVM = {
    canSearch: boolean;
}

export type UserInfoVM = {
    [key: string]: any;
    name?: string;
    email?: string;
    phone?: string;
}

export type State = {
    loading: boolean;
}
