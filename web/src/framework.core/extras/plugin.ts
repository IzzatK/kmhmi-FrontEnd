import {Nullable} from "./utils/typeUtils";
import {IBasePlugin, IRepositoryService} from "../../framework.core.api";
import {IRepoItem} from "../services";
import {BasePlugin} from "./basePlugin";
import {IEntityProvider} from "../../framework.core.api";

export abstract class Plugin extends BasePlugin implements IBasePlugin {
    public static class: string = 'SimplePlugin';

    private repoService: Nullable<IRepositoryService> = null;

    protected constructor()
    {
        super();

        super.appendClassName(`${Plugin.class}`);
    }

    start(): void {
        super.start();
    }

    stop(): void {
    }

    configure(): void {
    }

    setRepositoryService(repoService: Nullable<IRepositoryService>) {
        this.repoService = repoService;
    }

    protected addOrUpdateRepoItem<T extends IRepoItem>(item: T) {
        this.repoService?.addOrUpdateRepoItem(item);
    }

    protected addOrUpdateAllRepoItems<T extends IRepoItem>(items: T[]) {
        this.repoService?.addOrUpdateAllRepoItems(items);
    }

    protected getRepoItem<T extends IRepoItem>(className: string, id: string): Nullable<T> {
        let result: Nullable<T> = null;

        if (this.repoService != null) {
            result = this.repoService.getSingle<T>(className, id);
        }
        return result;
    }

    protected getAll<T extends IRepoItem>(className: string, includeSubTypes?: boolean, ...ids: string[]): Record<string, T> {
        let result: Record<string, T> = {};

        if (this.repoService != null) {
            result = this.repoService.getAll<T>(className, false, ...ids);
        }

        return result;
    }

    protected removeRepoItem<T extends IRepoItem>(item: T) {
        this.repoService?.removeRepoItem(item);
    }

    protected removeRepoItems<T extends IRepoItem>(items: T[]) {
        this.repoService?.removeRepoItems(items);
    }

    protected removeAllByType<T extends IRepoItem>(className: string) {
        this.repoService?.removeByType(className, false);
    }

    protected removeAllById<T extends IRepoItem>(className: string, ...ids: string[]) {
        this.repoService?.removeById(className, ...ids);
    }

    protected getRepoState() : any | undefined {
        let result = undefined;
        if (this.repoService) {
            result = this.repoService.getState();
        }
        return result;
    }

    protected deleteRemoteItem<EntityType extends IRepoItem>(className: string, id: string, entityProvider: Nullable<IEntityProvider<EntityType>>, updateLocal: boolean = true ) {
        return new Promise<Nullable<EntityType>>((resolve, reject) => {

                const entity = this.getRepoItem<EntityType>(className, id);

                if (entity == null) {
                    this.error(`Entity does not exist locally`);
                    reject(null);
                }
                else {
                    let lastPathIndex = entity.className.lastIndexOf('/');
                    let shortClassName = entity.className.slice(0, lastPathIndex);

                    if (entityProvider == null) {
                        this.error(`${shortClassName} Provider is null!`);
                        reject(null);
                    }
                    else {
                        entityProvider.remove(entity.id)
                            .then(result => {
                                if (result != null && updateLocal) {
                                    this.removeRepoItem(result);

                                    resolve(result);
                                }
                                else {
                                    reject(null);
                                }
                            })
                            .catch(error => {
                                this.error(`Error while deleting ${shortClassName} with id ${entity.id} + ${error}`);
                                reject(null);
                            });
                    }
                }
            }
        );
    }

    protected addOrUpdateRemoteItem<EntityType extends IRepoItem, ParamType extends {id?: string}>(entityClassName: string, entityProvider: Nullable<IEntityProvider<EntityType>>, params: ParamType, updateLocal: boolean = true) {
        return new Promise<EntityType>((resolve, reject) => {
                let lastPathIndex = entityClassName.lastIndexOf('/');
                let shortClassName = entityClassName.slice(0, lastPathIndex);

                if (params.id != null) {
                    const repoItem = this.getRepoItem<EntityType>(entityClassName, params.id);

                    if (repoItem != null) {
                        if (entityProvider != null) {
                            entityProvider.update(params.id, params)
                                .then(result => {
                                    if (result != null && updateLocal) {
                                        this.addOrUpdateRepoItem(result);
                                    }
                                    resolve(result || repoItem);
                                })
                                .catch(error => {
                                    this.error(`Error while updating ${shortClassName} \n ${error}`);
                                    reject(repoItem);
                                })
                        }
                        else {
                            reject(repoItem);
                        }
                    }
                    else {
                        this.error(`Error while retrieving ${shortClassName}: ${shortClassName} id was supplied but does not exist locally`);
                    }
                }
                else {
                    if (entityProvider == null) {
                        this.error(`${shortClassName} Provider is null!`);
                        reject(null);
                    }
                    else {
                        entityProvider.create(params)
                            .then(result => {
                                if (result != null) {
                                    if (updateLocal) {
                                        this.addOrUpdateRepoItem(result);
                                    }
                                    resolve(result);
                                }
                                else {
                                    reject(null);
                                }
                            })
                            .catch(error => {
                                this.error(error + `\nError while creating ${shortClassName} with params ${JSON.stringify(params)}`);
                                reject(null);
                            });
                    }
                }
            }
        );
    }
}
