import {IPlugin, IStorage} from "../../framework.api";
import {IEntityProvider} from "../../framework.api";
import {PermissionInfo} from "../../app.model";
import {Nullable} from "../../framework.core/extras/utils/typeUtils";
import {UserInfo} from "../../app.model";
import {IAuthenticationService} from "../authentication/iAuthenticationService";

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
    setAppDataStore(appDataStore: IStorage): void;

    fetchPermissions(userId: string): void;
    getPermissionLevel(entity: PERMISSION_ENTITY, operator: PERMISSION_OPERATOR): PERMISSION_LEVEL;
    getPermissions(): Record<string, PermissionInfo>;
    hasPermission(entity: PERMISSION_ENTITY, operator: PERMISSION_OPERATOR, currentUserId?: string, entityOwnerId?: Nullable<string>) : boolean;

    setPermissionProvider(provider: IEntityProvider<PermissionInfo>): void;
    setUserProvider(provider: IEntityProvider<UserInfo>): void;
    setAuthenticationService(service: IAuthenticationService): void;

    authorizeUser(userId: string): void;
    isAuthorizing(): boolean;
    isAuthorized(): boolean;

    setDodWarningAccepted(value: boolean): void;
    isDodWarningAccepted(): boolean;
}
