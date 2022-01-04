import {Nullable} from "../extras/typeUtils";
import {IRepositoryService} from "./repoService/iRepoService";
import {IRepoItem} from "../services/repoService/repoItem";
import {IBasePlugin} from "./IBasePlugin";

export interface IPlugin extends IBasePlugin {

    setRepositoryService(repoService: Nullable<IRepositoryService>): void;

    addOrUpdateRepoItem<T extends IRepoItem>(item: T): void;

    addOrUpdateAllRepoItems<T extends IRepoItem>(items: T[]): void;

    getRepoItem<T extends IRepoItem>(className: string, id: string): Nullable<T>;

    getAll<T extends IRepoItem>(className: string, includeSubTypes?: boolean, ...ids: string[]): Record<string, T>;

    removeRepoItem<T extends IRepoItem>(item: T): void;

    removeAllByType<T extends IRepoItem>(className: string): void;

    removeAllById<T extends IRepoItem>(className: string, ...ids: string[]): void;

    getRepoState(): any;
}
