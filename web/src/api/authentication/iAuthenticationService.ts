import {IPlugin} from "../../framework/api";
import {IStorage} from "../../framework/api";
import {IUserService} from "../users/iUserService";

export interface IAuthenticationService extends IPlugin {
    initKeycloak(onAuthenticatedCallback: any, onRegisterCallback: any): void;

    doLogin(): any;

    doLogout(): any;

    getToken(): string;

    isLoggedIn(): boolean;

    onError(message: string): void;

    updateToken(successCallback: any): any;

    getUsername(): any;

    getUserProfile(): {firstName: string, lastName: string, username: string, id: string, email: string };

    getUserId(): any;

    hasRole(roles: any): any;

    keyCloakEnabled(): boolean;

    setAppDataStore(appDataStore: IStorage): void;

    setUserService(userService: IUserService): void;
}
