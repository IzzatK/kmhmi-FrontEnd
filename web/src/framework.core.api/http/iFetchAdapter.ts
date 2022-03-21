import {RequestInfo} from "node-fetch";

export interface IFetchAdapter {
    execute(input: RequestInfo, init?: RequestInit): Promise<Response>;
}