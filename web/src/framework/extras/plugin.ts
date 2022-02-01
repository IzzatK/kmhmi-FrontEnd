import {Nullable} from "./typeUtils";
import {IBasePlugin, IRepositoryService} from "../../framework.api";
import {IRepoItem} from "../services/repoService/repoItem";
import {BasePlugin} from "./basePlugin";


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
            result = this.repoService.getRepoItem<T>(className, id);
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

    protected removeAllByType<T extends IRepoItem>(className: string) {
        this.repoService?.removeAllByType(className, false);
    }

    protected removeAllById<T extends IRepoItem>(className: string, ...ids: string[]) {
        this.repoService?.removeAllById(className, ...ids);
    }

    protected getRepoState() : any {
        return this.repoService?.getState();
    }
}
