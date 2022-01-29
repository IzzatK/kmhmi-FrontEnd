import {Nullable} from "../framework/extras/typeUtils";
import {IRepositoryService} from "./repoService/iRepoService";
import {IRepoItem} from "../framework/services/repoService/repoItem";
import {IBasePlugin} from "./IBasePlugin";

export interface IPlugin extends IBasePlugin {

    setRepositoryService(repoService: Nullable<IRepositoryService>): void;
}
