import {IBasePlugin} from "../IBasePlugin";
import {IStorage} from "../iDataStore";
import {OutputSelector} from "@reduxjs/toolkit";

export interface ISelectionService extends IBasePlugin {
    getContext(key: string): string;

    setContext(key: string, value: string): void;

    makeGetContext(key: string):  OutputSelector<any, any, (res: any) => any>;

    setAppDataStore(appDataStore: IStorage): void;
}
