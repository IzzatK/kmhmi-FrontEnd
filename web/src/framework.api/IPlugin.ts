import {Nullable} from "../framework.core/extras/typeUtils";
import {IRepositoryService} from "./repoService/iRepoService";
import {IRepoItem} from "../framework.core/services/repoService/repoItem";
import {IBasePlugin} from "./IBasePlugin";

export interface IPlugin extends IBasePlugin {

    setRepositoryService(repoService: Nullable<IRepositoryService>): void;
}
