import {IBasePlugin} from "../IBasePlugin";
import {IStorage} from "../iDataStore";
import {OutputSelector} from "@reduxjs/toolkit";

export interface ISelectionService extends IBasePlugin {
    getContext(key: string): any;

    setContext(key: string, value: string): void;

    makeGetContext(key: string):  OutputSelector<unknown, any, (res: any) => any>;

    setAppDataStore(appDataStore: IStorage): void;
}
