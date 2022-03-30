import {EntityProvider} from "../../common/providers/entityProvider";
import {PocketInfo, PocketMapper,} from "../../../app.model";
import {Nullable} from "../../../framework.core/extras/utils/typeUtils";
import {PocketRequestConverter} from "../converters/pockets/pocketRequestConverter";
import {PocketResponseConverter} from "../converters/pockets/pocketResponseConverter";
import {PocketStatusResponseConverter} from "../converters/pockets/pocketStatusResponseConverter";
import {GetPocketArrayResponseConverter} from "../converters/pockets/getPocketArrayResponseConverter";
import {GetPocketArrayRequestConverter} from "../converters/pockets/getPocketArrayRequestConverter";
import {CreatePocketRequestConverter} from "../converters/pockets/createPocketRequestConverter";
import {PocketParamType} from "../../../app.core.api";
import {forEachKVP} from "../../../framework.core/extras/utils/collectionUtils";

const serverUrl = process.env.REACT_APP_SERVER_URL;

export class PocketProvider extends EntityProvider<PocketMapper> {
    baseUrl: string = `${serverUrl}/pockets`;
    public static class: string = 'PocketProvider';

    private getPocketArrayRequestConverter!: GetPocketArrayRequestConverter;
    private getPocketArrayResponseConverter!: GetPocketArrayResponseConverter;

    private pocketRequestConverter!: PocketRequestConverter;
    private pocketResponseConverter!: PocketResponseConverter;
    private pocketStatusResponseConverter!: PocketStatusResponseConverter;

    private createPocketRequestConverter!: CreatePocketRequestConverter;

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

    create(uiRequestData: PocketParamType, onUpdated?: (item: PocketMapper) => void): Promise<Nullable<PocketMapper>> {
        return new Promise((resolve, reject) => {
            super.sendPost(() => this.createPocketRequestConverter.convert(uiRequestData),
                (responseData, errorHandler) => this.pocketStatusResponseConverter.convert(responseData, errorHandler))
                .then(data => {
                    const { id } = data;

                    const pocket = new PocketInfo(id);
                    pocket.title = uiRequestData.title || "";
                    pocket.author_id = uiRequestData.author_id || "";
                    pocket.isUpdating = false;

                    const pocketMapper = new PocketMapper(pocket)
                    resolve(pocketMapper);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    update(id: string, uiRequestData: any): Promise<Nullable<PocketMapper>> {
        return new Promise((resolve, reject) => {
            this.sendPut(id,
                () => this.pocketRequestConverter.convert(uiRequestData),
                (responseData, errorHandler) => this.pocketResponseConverter.convert(responseData, errorHandler))
                .then(pocket => {
                    resolve(pocket);
                })
                .catch(error => {
                    console.log(error);
                });
            }
        )
    }

    getAll(uiRequestData?: any): Promise<PocketMapper[]> {
        return new Promise((resolve, reject) => {
            let requestData: any = this.getPocketArrayRequestConverter.convert(uiRequestData);

            this.httpService?.createPOST(`${serverUrl}/documents/search`, requestData)
                .then((data: any) => {
                    resolve(this.getPocketArrayResponseConverter.convert(data, reject));
                })
                .catch((error: any) => {
                    reject(requestData);
                })
        });
    }
}


