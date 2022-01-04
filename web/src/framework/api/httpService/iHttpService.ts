import {IBasePlugin} from "../IBasePlugin";
import {ILogger} from "../logService/iLogger";
import {Nullable} from "../../extras/typeUtils";
import {IAuthenticationService} from "../../../api";

export interface IHttpService extends IBasePlugin, ILogger{
    setAuthenticationService(authenticationService: Nullable<IAuthenticationService>): void;

    createAPI(url: string, command?: string, body?: any, format?: string): any;

    createFormAPI(url: string, formData: any): any;

    createGET(url: string): any;

    createPUT(url: string, body: any): any;

    createDELETE(url: string): any;

    createPOST(url: string, body: any): any;
}
