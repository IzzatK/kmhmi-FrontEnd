import {Nullable} from "../extras/typeUtils";
import {IRepositoryService} from "./repoService/iRepoService";
import {IRepoItem} from "../services/repoService/repoItem";
import {IBasePlugin} from "./IBasePlugin";

export interface IPlugin extends IBasePlugin {

    setRepositoryService(repoService: Nullable<IRepositoryService>): void;
}
