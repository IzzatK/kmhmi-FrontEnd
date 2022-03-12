import {Nullable} from "../framework.core/extras/typeUtils";
import {IRepositoryService} from "./repoService/iRepoService";
import {IBasePlugin} from "./IBasePlugin";

export interface IPlugin extends IBasePlugin {

    setRepositoryService(repoService: Nullable<IRepositoryService>): void;
}
