import {IBasePlugin} from "../IBasePlugin";
import {ILogger} from "../logService/iLogger";
import {Nullable} from "../../framework.core/extras/typeUtils";
import {IAuthenticationService} from "../../app.core.api";

export interface IHttpService extends IBasePlugin, ILogger{
    setAuthenticationService(authenticationService: Nullable<IAuthenticationService>): void;

    createFormAPI(url: string, formData: any): Promise<any>;

    createGET(url: string): Promise<any>;

    createPUT(url: string, body: any): Promise<any>;

    createDELETE(url: string): Promise<any>;

    createPOST(url: string, body: any): Promise<any>;
}
