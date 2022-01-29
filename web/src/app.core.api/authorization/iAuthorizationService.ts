import {IPlugin} from "../../framework.api";
import {IEntityProvider} from "../common/iEntityProvider";
import {PermissionInfo} from "../../app.model/permissionInfo";
import {Nullable} from "../../framework/extras/typeUtils";

export enum PERMISSION_ENTITY {
    NONE='NONE',
    DOCUMENT='DOCUMENT',
    OPTIONS='OPTIONS',
    STAT='STAT',
    TAG='TAG',
    USER='USER'
}

export enum PERMISSION_OPERATOR {
    NONE='NONE',
    GET='GET',
    DOWNLOAD='DOWNLOAD',
    MODIFY='MODIFY',
    POST='POST',
    DELETE='DELETE',
}

export enum PERMISSION_LEVEL {
    NONE,
    SELF,
    GROUP,
    ANY
}

export interface IAuthorizationService extends IPlugin {
    fetchPermissions(userId: string): void;
    getPermissionLevel(entity: PERMISSION_ENTITY, operator: PERMISSION_OPERATOR): PERMISSION_LEVEL;
    getPermissions(): Record<string, PermissionInfo>;
    hasPermission(entity: PERMISSION_ENTITY, operator: PERMISSION_OPERATOR, currentUserId?: string, entityOwnerId?: Nullable<string>) : boolean;

    setPermissionProvider(provider: IEntityProvider<PermissionInfo>): void;
}
