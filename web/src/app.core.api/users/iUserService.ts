import {UserInfo} from "../../app.model";
import {IPlugin} from "../../framework.core.api";
import {ISelectionService} from "../../framework.core.api";
import {IReferenceService} from "../references/iReferenceService";
import {IEntityProvider} from "../../framework.core.api/iEntityProvider";
import {Nullable} from "../../framework.core/extras/utils/typeUtils";
import {IAuthorizationService} from "../authorization/iAuthorizationService";
import {UserRequestInfo} from "../../app.model";
import {IAuthenticationService} from "../authentication/iAuthenticationService";

export interface IUserService extends IPlugin {
    fetchUser(id: string): Promise<Nullable<UserInfo>>;

    fetchUsers(): void;

    getUser(id: string): Nullable<UserInfo>;

    getActiveUsers(): Record<string, UserInfo>;

    createUser(userData: Record<string, any>): void;

    updateUser(modifiedUser: Record<string, any>): void;

    removeUser(id: string): void;

    getCurrentUser(): Nullable<UserInfo>;

    getCurrentUserId(): string;

    getUserRequests(): Record<string, UserRequestInfo>;

    getPendingUsers(): Record<string, UserInfo>;

    acceptUserRequest(id: string, role: string): void;

    declineUserRequest(id: string): void;

    setSelectionService(selectionService: ISelectionService): void;

    setAuthorizationService(authorizationService: IAuthorizationService): void;

    setAuthenticationService(authenticationService: IAuthenticationService): void;

    setReferenceService(referenceService: IReferenceService): void;

    setUserProvider(provider: IEntityProvider<UserInfo>): void;

    clearSearch(): void;

    setSearchText(value: string): void;

    getSearchText(): string;

    getSearchUsers(): Record<string, UserInfo>;
}

type OmitParamsType = 'className';

export type UserParamType = Omit<Partial<UserInfo>, OmitParamsType>
