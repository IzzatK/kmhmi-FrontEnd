import {IFetchAdapter} from "../../framework.core.api";

export class BrowserFetchAdapter implements IFetchAdapter {
    execute(input: any, init?: any): Promise<any> {
        return fetch(input, init);
    }
}