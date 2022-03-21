import fetch, {RequestInfo, RequestInit} from "node-fetch";
import * as https from "https";
import {IFetchAdapter} from "../../framework.core.api";

export class NodeFetchAdapter implements IFetchAdapter {
    execute(input: any, init?: any): Promise<any> {
        init.agent = new https.Agent({
            rejectUnauthorized: false, // TODO: remove this when self signed certificate is fixed
        });

        return fetch(input, init);
    }

}