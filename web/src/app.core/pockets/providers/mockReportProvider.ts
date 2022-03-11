import {EntityProvider} from "../../common/providers/entityProvider";
import {ExcerptInfo, NoteInfo, PocketInfo, PocketMapper, ReportInfo} from "../../../app.model";
import {Nullable} from "../../../framework.core/extras/typeUtils";
import {forEach} from "../../../framework.visual/extras/utils/collectionUtils";
import {makeGuid} from "../../../framework.visual/extras/utils/uniqueIdUtils";
import {ReportMapper} from "../../../app.model/pockets/mappers/reportMapper";
import {ReportParamType} from "../../../app.core.api";

export const serverUrl = process.env.REACT_APP_SERVER_URL;

export class MockReportProvider extends EntityProvider<ReportInfo> {
    baseUrl: string = `${serverUrl}/pockets/reports`;
    public static class: string = 'MockReportProvider';

    constructor() {
        super();
        super.appendClassName(MockReportProvider.class);
    }

    create(uiRequestData: ReportParamType, onUpdated?: (item: ReportInfo) => void): Promise<Nullable<ReportInfo>> {
        return new Promise((resolve, reject) => {
            let result = generateReport(uiRequestData);

            resolve(result);
        });
    }
}

const generateReport = (data: ReportParamType): ReportInfo => {
    const report = new ReportInfo(makeGuid());

    report.author_id = data.author_id || report.author_id;
    report.date = data.date || report.date;
    report.document_ids = data.document_ids || report.document_ids;
    report.title = data.title || report.title;

    return report;
}


