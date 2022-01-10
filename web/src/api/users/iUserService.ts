import {UserInfo} from "../../model";
import {IPlugin} from "../../framework/api";
import {ISelectionService} from "../../framework/api";
import {IReferenceService} from "../references/iReferenceService";
import {IEntityProvider} from "../common/iEntityProvider";
import {Nullable} from "../../framework/extras/typeUtils";
import {IAuthorizationService} from "../authorization/iAuthorizationService";

export interface IUserService extends IPlugin {
    fetchUser(id: string): void;

    fetchUsers(): void;

    getUser(id: string): any;

    getUsers(): any;

    createUser(userData: any): void;

    updateUser(modifiedUser: UserInfo): void;

    removeUser(id: string): void;

    setCurrentUser(id: string): void;

    getCurrentUser(): Nullable<UserInfo>;

    getCurrentUserId(): string;

    setSelectionService(selectionService: ISelectionService): void;

    setAuthorizationService(authorizationService: IAuthorizationService): void;

    setReferenceService(referenceService: IReferenceService): void;

    setUserProvider(provider: IEntityProvider<UserInfo>): void;
}
