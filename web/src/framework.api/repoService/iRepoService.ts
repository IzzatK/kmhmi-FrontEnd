import {Nullable} from "../../framework.core/extras/typeUtils";
import {Dispatch} from "@reduxjs/toolkit";
import {IStorage} from "../iDataStore";
import {IRepoItem} from "../../framework.core/services/repoService/repoItem";
import {IBasePlugin} from "../IBasePlugin";

export interface IRepositoryService extends IBasePlugin {
    setStorage(value: Nullable<IStorage>): void;

    getRepoItem<Type extends IRepoItem>(className: string, id: string): Nullable<Type>;

    getAll<Type extends IRepoItem>(className: string, includeSubTypes?: boolean, ...ids: string[]): Record<string, Type>;

    removeAllByType(className: string, includeSubTypes?: boolean): void;

    addOrUpdateRepoItem<Type extends IRepoItem>(item: Type): void;

    addOrUpdateAllRepoItems<Type extends IRepoItem>(items: Type[]): void;

    removeRepoItem<Type extends IRepoItem>(item: Type): void;

    removeAllById(className: string, ...ids: string[]): void;

    getState(): any;
}
