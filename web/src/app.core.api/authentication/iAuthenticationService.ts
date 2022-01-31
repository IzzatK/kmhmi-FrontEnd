import {IPlugin} from "../../framework.api";
import {IStorage} from "../../framework.api";
import {IUserService} from "../users/iUserService";
import {IUserProvider} from "../users/IUserProvider";
import {UserInfo} from "../../app.model";

export interface IAuthenticationService extends IPlugin {
    login(): any;
    logout(): any;
    register(user: UserInfo): void;
    securedFetch(successCallback: any): any;

    isLoggedIn(): boolean;
    getToken(): string;
    getUserProfile(): AuthenticationProfile;
    getUserId(): any;
    getRegistrationStatus(): RegistrationStatus;

    getAuthenticationState(): any;

    setAppDataStore(appDataStore: IStorage): void;
    setUserService(userService: IUserService): void;
    setUserProvider(userProvider: IUserProvider): void;
}

export type AuthenticationProfile = {
    id: string,
    username: string,
    firstName: string,
    lastName: string,
    email: string
}

export enum RegistrationStatus {
    NONE,
    SUBMITTED,
    APPROVED,
    REJECTED
}
