import {EntityProvider} from "../../common/providers/entityProvider";
import {PocketMapper,} from "../../../app.model";
import {Nullable} from "../../../framework.core/extras/utils/typeUtils";
import {PocketRequestConverter} from "../converters/pockets/pocketRequestConverter";
import {PocketResponseConverter} from "../converters/pockets/pocketResponseConverter";
import {PocketStatusResponseConverter} from "../converters/pockets/pocketStatusResponseConverter";
import {GetPocketArrayResponseConverter} from "../converters/pockets/getPocketArrayResponseConverter";
import {GetPocketArrayRequestConverter} from "../converters/pockets/getPocketArrayRequestConverter";
import {CreatePocketRequestConverter} from "../converters/pockets/creatPocketRequestConverter";

const serverUrl = process.env.REACT_APP_SERVER_URL;

export class PocketProvider extends EntityProvider<PocketMapper> {
    baseUrl: string = `${serverUrl}/pockets`;
    public static class: string = 'PocketProvider';

    private pocketRequestConverter!: PocketRequestConverter;
    private pocketResponseConverter!: PocketResponseConverter;
    private pocketStatusResponseConverter!: PocketStatusResponseConverter;

    private createPocketRequestConverter!: CreatePocketRequestConverter;

    private getPocketArrayRequestConverter!: GetPocketArrayRequestConverter;
    private getPocketArrayResponseConverter!: GetPocketArrayResponseConverter;

    constructor() {
        super();
        super.appendClassName(PocketProvider.class);
    }

    start() {
        super.start();

        this.pocketRequestConverter = this.addConverter(PocketRequestConverter);
        this.pocketResponseConverter = this.addConverter(PocketResponseConverter);
        this.pocketStatusResponseConverter = this.addConverter(PocketStatusResponseConverter);

        this.createPocketRequestConverter = this.addConverter(CreatePocketRequestConverter);

        this.getPocketArrayRequestConverter = this.addConverter(GetPocketArrayRequestConverter);
        this.getPocketArrayResponseConverter = this.addConverter(GetPocketArrayResponseConverter);
        this.getPocketArrayResponseConverter.singleConverter = this.pocketResponseConverter;
    }

    getAll(uiRequestData?: any): Promise<PocketMapper[]> {
        return new Promise((resolve, reject) => {
            super.sendGetAll(
                () => this.getPocketArrayRequestConverter.convert(uiRequestData),
                (responseData, reject) => this.getPocketArrayResponseConverter.convert(responseData, reject))
                .then(pocketMappers => {
                    resolve(pocketMappers);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    getSingle(id: string): Promise<Nullable<PocketMapper>> {
        return new Promise((resolve, reject) => {
            super.sendGetSingle(id,
                (responseData, reject) => this.pocketResponseConverter.convert(responseData, reject))
                .then(pocketMapper => {
                    if (pocketMapper != null) {
                        resolve(pocketMapper);
                    }
                    else {
                        reject(pocketMapper);
                    }
                })
                .catch(error => {
                    reject(error);
                })
        });
    }

    remove(id: string): Promise<Nullable<PocketMapper>> {
        return new Promise((resolve, reject) => {
            this.getSingle(id)
                .then(pocketMapper => {
                    if (pocketMapper != null) {
                        super.sendDelete(id,
                            (responseData, errorHandler) => this.pocketStatusResponseConverter.convert(responseData, errorHandler))
                            .then(data => {
                                if (data.id === pocketMapper.id) {
                                    resolve(pocketMapper);
                                }
                                else {
                                    reject('Could not delete pocket');
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

    create(uiRequestData: PocketMapper, onUpdated?: (item: PocketMapper) => void): Promise<Nullable<PocketMapper>> {
        return new Promise((resolve, reject) => {
            super.sendPost(() => this.createPocketRequestConverter.convert(uiRequestData),
                (responseData, errorHandler) => this.pocketStatusResponseConverter.convert(responseData, errorHandler))
                .then(data => {
                    const { id } = data;

                    uiRequestData.pocket.id = id;

                    if (onUpdated) {
                        onUpdated(uiRequestData);
                    }

                    // it's a single fetch to get the new user
                    setTimeout(() => {
                        this.getSingle(id)
                            .then(pocketMapper => {
                                resolve(pocketMapper);
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

    update(id: string, uiRequestData: any): Promise<Nullable<PocketMapper>> {
        return new Promise((resolve, reject) => {
            this.getSingle(id)
                .then(latestPocketMapper => {
                    if (latestPocketMapper != null) {
                        this.sendPut(id,
                            () => this.pocketRequestConverter.convert(latestPocketMapper),
                            (responseData, errorHandler) => this.pocketResponseConverter.convert(responseData, errorHandler))
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


