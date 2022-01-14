import {IPlugin} from "../../framework/api";
import {IStorage} from "../../framework/api";
import {IUserService} from "../users/iUserService";
import {IUserProvider} from "../users/IUserProvider";
import {UserInfo} from "../../model";

export interface IAuthenticationService extends IPlugin {
    login(): any;
    logout(): any;
    register(user: UserInfo): void;
    updateToken(successCallback: any): any;

    isLoggedIn(): boolean;
    getToken(): string;
    getUserProfile(): {firstName: string, lastName: string, username: string, id: string, email: string };
    getUserId(): any;

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
