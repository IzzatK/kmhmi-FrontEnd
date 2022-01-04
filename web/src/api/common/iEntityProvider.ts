import {Nullable} from "../../framework/extras/typeUtils";
import {IBasePlugin, IRepositoryService} from "../../framework/api";
import {ILoggablePlugin} from "../../framework/api";
import {IHttpService} from "../../framework/api";

export interface IEntityProvider<EntityType> extends IBasePlugin, ILoggablePlugin{
    getSingle(id: string): Promise<Nullable<EntityType>>;

    getAll(uiRequestData?: any): Promise<EntityType[]>;

    create(uiRequestData: any, onUpdated?: (item: EntityType) => void): Promise<Nullable<EntityType>>;

    update(id: string, uiRequestData: any): Promise<Nullable<EntityType>>;

    remove(id: string): Promise<Nullable<EntityType>>;

    setHttpService(value: Nullable<IHttpService>): void;

    setRepositoryService(value: Nullable<IRepositoryService>): void;
}
