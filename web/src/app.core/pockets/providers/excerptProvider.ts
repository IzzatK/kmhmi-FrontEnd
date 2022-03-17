import {EntityProvider} from "../../common/providers/entityProvider";
import {ExcerptInfo} from "../../../app.model";
import {ExcerptRequestConverter} from "../converters/excerpts/excerptRequestConverter";
import {ExcerptResponseConverter} from "../converters/excerpts/excerptResponseConverter";
import {Nullable} from "../../../framework.core/extras/utils/typeUtils";
import {ExcerptStatusResponseConverter} from "../converters/excerpts/excerptStatusResponseConverter";

const serverUrl = process.env.REACT_APP_SERVER_URL;

export class ExcerptProvider extends EntityProvider<ExcerptInfo> {
    baseUrl: string = `${serverUrl}/pockets/excerpts`;
    public static class: string = 'ExcerptProvider';

    private excerptRequestConverter!: ExcerptRequestConverter;
    private excerptResponseConverter!: ExcerptResponseConverter;
    private excerptStatusResponseConverter!: ExcerptStatusResponseConverter;

    constructor() {
        super();
        super.appendClassName(ExcerptProvider.class);
    }

    start() {
        super.start();

        this.excerptRequestConverter = this.addConverter(ExcerptRequestConverter);
        this.excerptResponseConverter = this.addConverter(ExcerptResponseConverter);
        this.excerptStatusResponseConverter = this.addConverter(ExcerptStatusResponseConverter);
    }

    getSingle(id: string): Promise<Nullable<ExcerptInfo>> {
        return new Promise((resolve, reject) => {
            super.sendGetSingle(id,
                (responseData, reject) => this.excerptResponseConverter.convert(responseData, reject))
                .then(excerpt => {
                    if (excerpt != null) {
                        resolve(excerpt);
                    }
                    else {
                        reject(excerpt);
                    }
                })
                .catch(error => {
                    reject(error);
                })
        });
    }

    remove(id: string): Promise<Nullable<ExcerptInfo>> {
        return new Promise((resolve, reject) => {
            this.getSingle(id)
                .then(excerpt => {
                    if (excerpt != null) {
                        super.sendDelete(id,
                            (responseData, errorHandler) => this.excerptStatusResponseConverter.convert(responseData, errorHandler))
                            .then(data => {
                                if (data.id === excerpt.id) {
                                    resolve(excerpt);
                                }
                                else {
                                    reject('Could not delete excerpt');
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

    create(uiRequestData: ExcerptInfo, onUpdated?: (item: ExcerptInfo) => void): Promise<Nullable<ExcerptInfo>> {
        return new Promise((resolve, reject) => {
            super.sendPost(() => this.excerptRequestConverter.convert(uiRequestData),
                (responseData, errorHandler) => this.excerptStatusResponseConverter.convert(responseData, errorHandler))
                .then(data => {
                    const { id } = data;

                    uiRequestData.id = id;

                    if (onUpdated) {
                        onUpdated(uiRequestData);
                    }

                    // it's a single fetch to get the new user
                    setTimeout(() => {
                        this.getSingle(id)
                            .then(excerpt => {
                                resolve(excerpt);
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

    update(id: string, uiRequestData: any): Promise<Nullable<ExcerptInfo>> {
        return new Promise((resolve, reject) => {
            this.getSingle(id)
                .then(latestExcerpt => {
                    if (latestExcerpt != null) {
                        this.sendPut(id,
                            () => this.excerptRequestConverter.convert(latestExcerpt),
                            (responseData, errorHandler) => this.excerptResponseConverter.convert(responseData, errorHandler))
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


