import {EntityProvider} from "../../common/providers/entityProvider";
import {DocumentInfo} from "../../../app.model";
import {ReportRequestConverter} from "../converters/reportRequestConverter";
import {Nullable} from "../../../framework.core/extras/utils/typeUtils";
import {ReportStatusResponseConverter} from "../converters/reportStatusResponseConverter";

const serverUrl = process.env.REACT_APP_SERVER_URL;

export class PublishedReportProvider extends EntityProvider<DocumentInfo> {
    baseUrl: string = `${serverUrl}/pockets/reports`;
    public static class: string = 'ReportProvider';

    private reportRequestConverter!: ReportRequestConverter;
    private reportStatusResponseConverter!: ReportStatusResponseConverter;

    constructor() {
        super();
        super.appendClassName(PublishedReportProvider.class);
    }

    start() {
        super.start();

        this.reportRequestConverter = this.addConverter(ReportRequestConverter);
        this.reportStatusResponseConverter = this.addConverter(ReportStatusResponseConverter);
    }

    update(id: string, uiRequestData: any): Promise<Nullable<DocumentInfo>> {

        return new Promise((resolve, reject) => {
                this.sendPut(id,
                    () => this.reportRequestConverter.convert(uiRequestData),
                    (responseData, errorHandler) => this.reportStatusResponseConverter.convert(responseData, errorHandler))
                    .then(report => {
                        this.httpService?.createPOST(`${this.baseUrl}/${id}/publish`, null)
                            .then(status => {

                                const { type:id } = status;

                                const document = new DocumentInfo(id);

                                resolve(document);
                            })
                            .catch((error: any) => {
                                reject(error);
                            })
                    })
                    .catch(error => {
                        reject(error);
                    });
            }
        )
    }
}
