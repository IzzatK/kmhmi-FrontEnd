import {ILogger, ILogService, IRepositoryService, IStorage} from "../../../framework.api";
import {appDataStore} from "../../serviceComposition";
import {IHttpService} from "../../../framework.api";
import {Nullable} from "../../../framework/extras/typeUtils";
import {BasePlugin} from "../../../framework/extras/basePlugin";
import {IConverter, IEntityProvider} from "../../../core.api";
import {IRepoItem} from "../../../framework/services/repoService/repoItem";

export type RequestHandler = (requestData?: any) => any;
export type ResponseHandler<T> = (responseData: any, errorHandler: ErrorHandler) => T;
export type ErrorHandler = (error: string) => void;

export abstract class EntityProvider<EntityType> extends BasePlugin implements IEntityProvider<EntityType> {
    abstract baseUrl: string;
    protected store: IStorage = appDataStore;
    protected httpService: Nullable<IHttpService> = null;
    private repoService: Nullable<IRepositoryService> = null;

    protected converters: IConverter<any, any>[] = [];

    protected constructor() {
        super();
    }

    addConverter<T extends IConverter<any, any>>(ctor: {new(className: string, logger: Nullable<ILogger>): T}): T {
        const converter = new ctor(this.getClassName(), this.getLogger());
        converter.setRepositoryService(this.repoService);

        this.converters.push(converter);

        return converter;
    }

    setLogService(logService: Nullable<ILogService>) {
        super.setLogService(logService);

        // forEach(this.converters, (converter:IConverter<any, any>) => {
        //     converter.
        // })
    }

    setRepositoryService(service: Nullable<IRepositoryService>) {
        this.repoService = service;
    }

    protected getRepoItem<T extends IRepoItem>(className: string, id: string): Nullable<T> {
        let result: Nullable<T> = null;

        if (this.repoService != null) {
            result = this.repoService.getRepoItem<T>(className, id);
        }
        return result;
    }

    protected getRepoItems<T extends IRepoItem>(className: string, includeSubTypes: boolean = false, ...ids: string[]): Record<string, T> {
        let result: Record<string, T> = {};

        if (this.repoService != null) {
            result = this.repoService.getAll<T>(className, includeSubTypes, ...ids);
        }

        return result;
    }

    getSingle(id: string): Promise<Nullable<EntityType>> {
        this.error("getSingle method not implemented");
        throw new Error("Method not implemented.");
    }

    getAll(uiRequestData?: any): Promise<EntityType[]> {
        this.error("getAll method not implemented");
        throw new Error("Method not implemented.");
    }

    create(uiRequestData: any, onUpdated?: (item: EntityType) => void): Promise<Nullable<EntityType>> {
        this.error("create method not implemented");
        throw new Error("Method not implemented.");
    }

    update(id: string, uiRequestData: any): Promise<Nullable<EntityType>> {
        this.error("update method not implemented");
        throw new Error("Method not implemented.");
    }

    remove(id: string): Promise<Nullable<EntityType>> {
        this.error("remove method not implemented");
        throw new Error("Method not implemented.");
    }

    protected getState() {
        return this.store.getState()
    }

    getHttpService(): Nullable<IHttpService> {
        return this.httpService;
    }

    setHttpService(value: Nullable<IHttpService>) {
        this.httpService = value;
    }

    protected sendPost<ResponseType>(requestConverter: RequestHandler, responseConverter: ResponseHandler<ResponseType>) : Promise<ResponseType> {
        return new Promise((resolve, reject) => {
            this.httpService?.createPOST(`${this.baseUrl}`, requestConverter())
                .then((data: any) => {
                    resolve(responseConverter(data, reject));
                })
                .catch((error: any) => {
                    reject(error);
                })
        });
    }

    protected sendPut<ResponseType>(id: string, requestConverter: RequestHandler, responseConverter: ResponseHandler<ResponseType>) : Promise<ResponseType> {
        return new Promise((resolve, reject) => {
            this.httpService?.createPUT(`${this.baseUrl}/${id}`, requestConverter())
                .then((data: any) => {
                    resolve(responseConverter(data, reject));
                })
                .catch((error: any) => {
                    reject(error);
                })
        });
    }

    protected sendDelete<ResponseType>(id: string, responseConverter: ResponseHandler<ResponseType>) : Promise<ResponseType> {
        return new Promise((resolve, reject) => {
            this.httpService?.createDELETE(`${this.baseUrl}/${id}`)
                .then((data: any) => {
                    resolve(responseConverter(data, reject));
                })
                .catch((error: any) => {
                    reject(error);
                })
        });
    }

    protected sendGetSingle(id: string, responseConverter: ResponseHandler<Nullable<EntityType>>) : Promise<Nullable<EntityType>> {
        return new Promise((resolve, reject) => {
            if (!id) {
                reject('There is no id defined for url get request: ' + this.baseUrl);
            }
            else {
                this.httpService?.createGET(`${this.baseUrl}/${id}`)
                    .then((data: any) => {
                        resolve(responseConverter(data, reject));
                    })
                    .catch((error: any) => {
                        reject(error);
                    })
            }
        });
    }

    protected sendGetAll(requestConverter: RequestHandler, responseConverter: ResponseHandler<EntityType[]>) : Promise<EntityType[]> {
        return new Promise((resolve, reject) => {
            let requestData: any = requestConverter();

            this.httpService?.createGET(`${this.baseUrl}${requestData ? requestData : ''}`)
                .then((data: any) => {

                    const entityTypes = responseConverter(data, reject);

                    this.trace(JSON.stringify({
                        getAllData: entityTypes
                    }, undefined, '\t'));

                    resolve(entityTypes);
                })
                .catch((error: any) => {
                    reject(error);
                })
        });
    };

    protected sendForm<ResponseType>(requestConverter: RequestHandler, responseConverter: ResponseHandler<ResponseType>) : Promise<ResponseType> {
        return new Promise((resolve, reject) => {
            this.httpService?.createFormAPI(`${this.baseUrl}`, requestConverter())
                .then((data: any) => {
                    resolve(responseConverter(data, reject));
                })
                .catch((error: any) => {
                    reject(error);
                })
        });
    }
}
