import {EntityProvider} from "../../common/providers/entityProvider";
import {ResourceInfo} from "../../../app.model";
import {Nullable} from "../../../framework.core/extras/utils/typeUtils";
import {ResourceRequestConverter} from "../converters/resources/resourceRequestConverter";
import {ResourceResponseConverter} from "../converters/resources/resourceResponseConverter";
import {ResourceStatusResponseConverter} from "../converters/resources/resourceStatusResponseConverter";

const serverUrl = process.env.REACT_APP_SERVER_URL;

export class ResourceProvider extends EntityProvider<ResourceInfo> {
    baseUrl: string = `${serverUrl}/pockets/resource`;
    public static class: string = 'ExcerptProvider';

    private resourceRequestConverter!: ResourceRequestConverter;
    private resourceResponseConverter!: ResourceResponseConverter;
    private resourceStatusResponseConverter!: ResourceStatusResponseConverter;

    constructor() {
        super();
        super.appendClassName(ResourceProvider.class);
    }

    start() {
        super.start();

        this.resourceRequestConverter = this.addConverter(ResourceRequestConverter);
        this.resourceResponseConverter = this.addConverter(ResourceResponseConverter);
        this.resourceStatusResponseConverter = this.addConverter(ResourceStatusResponseConverter);
    }

    getSingle(id: string): Promise<Nullable<ResourceInfo>> {
        return new Promise((resolve, reject) => {
            super.sendGetSingle(id,
                (responseData, reject) => this.resourceResponseConverter.convert(responseData, reject))
                .then(resource => {
                    if (resource != null) {
                        resolve(resource);
                    }
                    else {
                        reject(resource);
                    }
                })
                .catch(error => {
                    reject(error);
                })
        });
    }

    remove(id: string): Promise<Nullable<ResourceInfo>> {
        return new Promise((resolve, reject) => {
            this.getSingle(id)
                .then(resource => {
                    if (resource != null) {
                        super.sendDelete(id,
                            (responseData, errorHandler) => this.resourceStatusResponseConverter.convert(responseData, errorHandler))
                            .then(data => {
                                if (data.id === resource.id) {
                                    resolve(resource);
                                }
                                else {
                                    reject('Could not delete resource');
                                }
                            })
                            .catch(error => {
                                reject(error);
                            })
                    }
                })
                .catch(error => {
                    reject(error);
                });
            }
        )
    }

    create(uiRequestData: ResourceInfo, onUpdated?: (item: ResourceInfo) => void): Promise<Nullable<ResourceInfo>> {
        return new Promise((resolve, reject) => {
            super.sendPost(() => this.resourceRequestConverter.convert(uiRequestData),
                (responseData, errorHandler) => this.resourceStatusResponseConverter.convert(responseData, errorHandler))
                .then(data => {
                    const { id } = data;

                    uiRequestData.id = id;

                    if (onUpdated) {
                        onUpdated(uiRequestData);
                    }

                    // it's a single fetch to get the new resource
                    setTimeout(() => {
                        this.getSingle(id)
                            .then(resource => {
                                resolve(resource);
                            })
                            .catch(error => {
                                reject(error);
                            });
                    }, 3000)
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    update(id: string, uiRequestData: any): Promise<Nullable<ResourceInfo>> {
        return new Promise((resolve, reject) => {
            this.getSingle(id)
                .then(latestResource => {
                    if (latestResource != null) {
                        this.sendPut(id,
                            () => this.resourceRequestConverter.convert(latestResource),
                            (responseData, errorHandler) => this.resourceResponseConverter.convert(responseData, errorHandler))
                            .then(excerpt => {
                                resolve(excerpt);
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                    else {
                        reject(null);
                    }
                });
            }
        )
    }
}


