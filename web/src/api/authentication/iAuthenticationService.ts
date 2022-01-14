import {IPlugin} from "../../framework/api";
import {IStorage} from "../../framework/api";
import {IUserService} from "../users/iUserService";
import {IUserProvider} from "../users/IUserProvider";

export interface IAuthenticationService extends IPlugin {
    login(): any;

    logout(): any;

    register(userData: Record<string, string>): void;

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

    setUserProvider(userProvider: IUserProvider): void;
}
