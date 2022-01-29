import {EntityProvider} from "../../common/providers/entityProvider";
import {GetStatsRequestConverter} from "../converters/getStatsRequestConverter";
import {GetStatsResponseConverter} from "../converters/getStatsResponseConverter";
import {StatInfo} from "../../../app.model";

const serverUrl = process.env.REACT_APP_SERVER_URL;

export class StatProvider extends EntityProvider<StatInfo> {
    baseUrl: string = `${serverUrl}/stats`;
    public static class: string = 'StatProvider';

    private getStatsRequestConverter!: GetStatsRequestConverter;
    private getStatsResponseConverter!: GetStatsResponseConverter;

    constructor() {
        super();
        super.appendClassName(StatProvider.class);
    }

    start() {
        super.start();

        this.getStatsRequestConverter = this.addConverter(GetStatsRequestConverter);
        this.getStatsResponseConverter = this.addConverter(GetStatsResponseConverter);
    }

    getAll(uiRequestData?: any): Promise<StatInfo[]> {
        return new Promise((resolve, reject) => {
            super.sendGetAll(
                () => this.getStatsRequestConverter.convert(uiRequestData),
                (responseData, reject) => this.getStatsResponseConverter.convert(responseData, reject))
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                })
        });
    }
}
