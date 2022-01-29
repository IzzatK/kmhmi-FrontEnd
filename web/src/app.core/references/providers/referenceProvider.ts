import {EntityProvider} from "../../common/providers/entityProvider";
import {ReferenceInfo, ReferenceType} from "../../../app";
import {GetReferenceArrayRequestConverter} from "../converters/getReferenceArrayRequestConverter";
import {GetReferenceArrayResponseConverter} from "../converters/getReferenceArrayResponseConverter";

const serverUrl = process.env.REACT_APP_SERVER_URL;

export class ReferenceProvider extends EntityProvider<ReferenceInfo> {
    baseUrl: string = `${serverUrl}/references`;
    public static class: string = 'ReferenceProvider';

    private getReferenceArrayRequestConverter!: GetReferenceArrayRequestConverter;
    private getReferenceArrayResponseConverter!: GetReferenceArrayResponseConverter;

    constructor() {
        super();
        super.appendClassName(ReferenceProvider.class);
    }

    start() {
        super.start();

        this.getReferenceArrayRequestConverter = this.addConverter(GetReferenceArrayRequestConverter);
        this.getReferenceArrayResponseConverter = this.addConverter(GetReferenceArrayResponseConverter);
    }

    getAll(uiRequestData: {id:ReferenceType}): Promise<ReferenceInfo[]> {
        return new Promise((resolve, reject) => {
            this.sendGetAll(
                () => this.getReferenceArrayRequestConverter.convert(uiRequestData),
                (responseData, errorHandler) => this.getReferenceArrayResponseConverter.convert(responseData, errorHandler, {referenceType: uiRequestData.id}))
                .then(references => {
                    resolve(references);
                })
                .catch(error => {
                    reject(error);
                })
        });
    }
}


