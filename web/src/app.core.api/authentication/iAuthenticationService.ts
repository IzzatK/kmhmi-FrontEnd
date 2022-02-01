import {IPlugin, IStorage} from "../../framework.api";
import {UserInfo} from "../../app.model";
import {IAuthorizationService} from "../authorization/iAuthorizationService";
import {IUserProvider} from "../users/IUserProvider";

export interface IAuthenticationService extends IPlugin {
    login(): any;
    logout(): any;
    register(user: UserInfo): void;
    securedFetch(successCallback: any): any;

    isLoggedIn(): boolean;
    isAuthenticating(): boolean;
    getToken(): string;
    getUserProfile(): AuthenticationProfile;
    getUserId(): any;
    getAuthenticationStatus(): AuthenticationStatus;

    getState(): any;

    setAppDataStore(appDataStore: IStorage): void;

    setUserProvider(userProvider: IUserProvider): void;
    setAuthorizationService(authorizationService: IAuthorizationService): void;

    setRegistrationStatus(status: AuthenticationStatus): void;
}

export type AuthenticationProfile = {
    id: string,
    username: string,
    firstName: string,
    lastName: string,
    email: string
}

export enum AuthenticationStatus {
    NONE='None',
    CREATED='Created',
    ACTIVE='Active',
    REJECTED='Rejected'
}
