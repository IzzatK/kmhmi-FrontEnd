import {EntityProvider} from "../../common/providers/entityProvider";
import {ReportInfo} from "../../../app.model";
import {ReportRequestConverter} from "../converters/reportRequestConverter";
import {ReportResponseConverter} from "../converters/reportResponseConverter";
import {Nullable} from "../../../framework.core/extras/utils/typeUtils";
import {ReportStatusResponseConverter} from "../converters/reportStatusResponseConverter";
import {GetReportArrayRequestConverter} from "../converters/getReportArrayRequestConverter";
import {GetReportArrayResponseConverter} from "../converters/getReportArrayResponseConverter";
import {CreateReportRequestConverter} from "../converters/createReportRequestConverter";

const serverUrl = process.env.REACT_APP_SERVER_URL;

export class ReportProvider extends EntityProvider<ReportInfo> {
    baseUrl: string = `${serverUrl}/pockets/reports`;
    public static class: string = 'ReportProvider';

    private reportRequestConverter!: ReportRequestConverter;
    private reportResponseConverter!: ReportResponseConverter;
    private reportStatusResponseConverter!: ReportStatusResponseConverter;

    private getReportArrayRequestConverter!: GetReportArrayRequestConverter;
    private getReportArrayResponseConverter!: GetReportArrayResponseConverter;

    private createReportRequestConverter!: CreateReportRequestConverter;

    constructor() {
        super();
        super.appendClassName(ReportProvider.class);
    }

    start() {
        super.start();

        this.reportRequestConverter = this.addConverter(ReportRequestConverter);
        this.reportResponseConverter = this.addConverter(ReportResponseConverter);
        this.reportStatusResponseConverter = this.addConverter(ReportStatusResponseConverter);

        this.getReportArrayRequestConverter = this.addConverter(GetReportArrayRequestConverter);
        this.getReportArrayResponseConverter = this.addConverter(GetReportArrayResponseConverter);
        this.getReportArrayResponseConverter.singleConverter = this.reportResponseConverter;

        this.createReportRequestConverter = this.addConverter(CreateReportRequestConverter);
    }

    getSingle(id: string): Promise<Nullable<ReportInfo>> {
        return new Promise((resolve, reject) => {
            super.sendGetSingle(id,
                (responseData, errorHandler) => this.reportResponseConverter.convert(responseData, errorHandler))
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                })
        });
    }

    getAll(uiRequestData?: any): Promise<ReportInfo[]> {
        return new Promise((resolve, reject) => {
            let requestData: any = this.getReportArrayRequestConverter.convert(uiRequestData);

            this.httpService?.createPOST(`${serverUrl}/documents/search`, requestData)
                .then((data: any) => {
                    resolve(this.getReportArrayResponseConverter.convert(data, reject));
                })
                .catch((error) => {
                    reject(error);
                })
        });
    }

    create(uiRequestData: any, onUpdated?: (item: ReportInfo) => void): Promise<Nullable<ReportInfo>> {
        return new Promise((resolve, reject) => {
            super.sendPost(() => this.createReportRequestConverter.convert(uiRequestData),
                (responseData, errorHandler) => this.reportStatusResponseConverter.convert(responseData, errorHandler))
                .then(data => {
                    const { id } = data;

                    const reportInfo = new ReportInfo(id);

                    reportInfo.author_id = uiRequestData.author_id;
                    reportInfo.title = uiRequestData.title;

                    resolve(reportInfo);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    update(id: string, uiRequestData: any): Promise<Nullable<ReportInfo>> {

        return new Promise((resolve, reject) => {
                this.sendPut(id,
                    () => this.reportRequestConverter.convert(uiRequestData),
                    (responseData, errorHandler) => this.reportResponseConverter.convert(responseData, errorHandler))
                    .then(pocket => {
                        resolve(pocket);
                    })
                    .catch(error => {
                        reject(error);
                    });
            }
        )
    }

    remove(id: string): Promise<Nullable<ReportInfo>> {
        return new Promise((resolve, reject) => {
                this.getSingle(id)
                    .then(pocketMapper => {
                        if (pocketMapper != null) {
                            super.sendDelete(id,
                                (responseData, errorHandler) => this.reportStatusResponseConverter.convert(responseData, errorHandler))
                                .then(data => {
                                    if (data.id === pocketMapper.id) {
                                        resolve(pocketMapper);
                                    }
                                    else {
                                        reject('Could not delete report');
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
}
