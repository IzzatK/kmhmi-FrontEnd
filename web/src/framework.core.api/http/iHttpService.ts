import {IBasePlugin} from "../IBasePlugin";
import {ILogger} from "../logging/iLogger";
import {Nullable} from "../../framework.core/extras/utils/typeUtils";
import {IAuthenticationService} from "../../app.core.api";
import {IFetchAdapter} from "./iFetchAdapter";

export interface IHttpService extends IBasePlugin, ILogger{
    setAuthenticationService(authenticationService: Nullable<IAuthenticationService>): void;

    createFormAPI(url: string, formData: any): Promise<any>;

    createGET(url: string): Promise<any>;

    createPUT(url: string, body: any): Promise<any>;

    createDELETE(url: string): Promise<any>;

    createPOST(url: string, body: any): Promise<any>;

    setFetchAdapter(fetchAdapter: IFetchAdapter): void;
}
