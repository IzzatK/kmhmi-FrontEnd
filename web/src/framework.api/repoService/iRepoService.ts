import {Nullable} from "../../framework.core/extras/typeUtils";
import {Dispatch} from "@reduxjs/toolkit";
import {IStorage} from "../iDataStore";
import {IRepoItem} from "../../framework.core/services/repoService/repoItem";
import {IBasePlugin} from "../IBasePlugin";

export interface IRepositoryService extends IBasePlugin {
    setStorage(value: Nullable<IStorage>): void;

    getState(): any;

    getSingle<Type extends IRepoItem>(className: string, id: string): Nullable<Type>;

    getAll<Type extends IRepoItem>(className: string, includeSubTypes?: boolean, ...ids: string[]): Record<string, Type>;

    getRepoKey<Type extends IRepoItem>(item: Type): string;

    addOrUpdateRepoItem<Type extends IRepoItem>(item: Type): void;

    addOrUpdateAllRepoItems<Type extends IRepoItem>(items: Type[]): void;

    removeRepoItem<Type extends IRepoItem>(item: Type): void;

    removeById(className: string, ...ids: string[]): void;

    removeByType(className: string, includeSubTypes?: boolean): void;

    removeRepoItems<Type extends IRepoItem>(items: Type[]): void;
}
