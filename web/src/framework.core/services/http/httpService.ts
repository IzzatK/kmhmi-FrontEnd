import {Nullable} from "../../extras/utils/typeUtils";
import {BasePlugin} from "../../extras/basePlugin";
import {IHttpService} from "../../../framework.core.api";
import {IAuthenticationService} from "../../../app.core.api";
import {IFetchAdapter} from "../../../framework.core.api/http/iFetchAdapter";

export class HttpService extends BasePlugin implements IHttpService {
    private authenticationService: Nullable<IAuthenticationService> = null;

    public static class: string = 'HttpService';

    private fetchAdapter: Nullable<IFetchAdapter> = null;

    constructor() {
        super();
        super.appendClassName(HttpService.class);
    }

    setFetchAdapter(fetchAdapter: IFetchAdapter): void {
        this.fetchAdapter = fetchAdapter;
    }

    start() {
        super.start();

        //check authentication service to be set
        if (this.authenticationService == null) {
            this.error("Authentication Service is Null");
        }
    }

    stop() {
        super.stop();
    }

    setAuthenticationService(authenticationService: Nullable<IAuthenticationService>) {
        this.authenticationService = authenticationService;

        if (this.authenticationService == null) {
            this.error("Authentication Service is Null");
        }
    }

    private createAPI(url: string, command?: string, body?: any, format?: string): Promise<any> {

        const options: RequestInit = {
            method: command ? command : 'GET',
        }

        let userProfile = this.authenticationService?.getUserProfile();
        let username = userProfile?.username || '';
        let id = userProfile?.id || '';
        let email = userProfile?.email || '';
        let firstName = userProfile?.firstName || '';
        let lastName = userProfile?.lastName || '';

        const headers = new Headers();
        headers.append('Authorization', `bearer ${this.authenticationService?.getToken()}`);
        // headers.append('km-user-name', username);
        // headers.append('km-user-id', id);
        // headers.append('km-email', email);
        // headers.append('km-first-name', firstName);
        // headers.append('km-last-name', lastName);

        if (body) {
            if (format === 'form') {
                options.body = body;
            } else {
                headers.append('Content-Type', 'application/json');
                options.body = JSON.stringify(body);
            }
        }

        options.headers = headers;

        const self = this;
        const fetchFxn = () => {
            return new Promise((resolve, reject) => {
                self.trace(JSON.stringify({
                    requestURL: url,
                    requestBody: options
                }, undefined, `\t`));

                if (this.fetchAdapter != null) {
                    this.fetchAdapter.execute(url, options)
                        .then(function (response) {
                            // convert to json object
                            if (format === 'form') {
                                return response.json();
                            } else {
                                return response.json();
                            }
                        })
                        .then(function (result) {
                            // return object to caller
                            self.trace(JSON.stringify({
                                responseURL: url,
                                responseData: result
                            }, undefined, `\t`));
                            return resolve(result);
                        })
                        .catch(function (error) {
                            self.trace(JSON.stringify({
                                responseURL: url,
                                error: error
                            }, undefined, `\t`));
                            reject(error);
                        });
                }
            });
        };


        if (this.authenticationService != null && this.authenticationService.isLoggedIn()) {
            return this.authenticationService.securedFetch(fetchFxn);
        } else {
            return fetchFxn();
        }
    }

    createFormAPI(url: string, formData: any) {
        return this.createAPI(url, 'POST', formData, 'form');
    }

    createGET(url: string) {
        return this.createAPI(url);
    }

    createPUT(url: string, body: any) {
        return this.createAPI(url, 'PUT', body);
    }

    createDELETE(url: string) {
        return this.createAPI(url, 'DELETE');
    }

    createPOST(url: string, body: any) {
        return this.createAPI(url, 'POST', body);
    }
}
