import {Nullable} from "../framework.core/extras/typeUtils";
import {IBasePlugin, IRepositoryService} from "./index";
import {ILoggablePlugin} from "./index";
import {IHttpService} from "./index";

export interface IEntityProvider<EntityType> extends IBasePlugin, ILoggablePlugin{
    getSingle(id: string): Promise<Nullable<EntityType>>;

    getAll(uiRequestData?: any): Promise<EntityType[]>;

    create(uiRequestData: any, onUpdated?: (item: EntityType) => void): Promise<Nullable<EntityType>>;

    update(id: string, uiRequestData: any, onUpdated?: (item: EntityType) => void): Promise<Nullable<EntityType>>;

    remove(id: string, onUpdated?: (item: EntityType) => void): Promise<Nullable<EntityType>>;

    setHttpService(value: Nullable<IHttpService>): void;

    setRepositoryService(value: Nullable<IRepositoryService>): void;
}
