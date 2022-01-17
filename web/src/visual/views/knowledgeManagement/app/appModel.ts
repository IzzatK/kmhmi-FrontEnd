import {Nullable} from "../../../../framework/extras/typeUtils";

export type StateProps = {
    className?: string;
    currentSystemTool: any;
    docPreviewTool: any;
    permissions: PermissionsVM;
    admin?: Nullable<UserInfoVM>;
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
