import {EntityProvider} from "../../../app.core";
import {ReportInfo,} from "../../../app.model";
import {deepCopy, Nullable} from "../../../framework.core/extras/utils/typeUtils";
import {forEach, forEachKVP} from "../../../framework.core/extras/utils/collectionUtils";
import {makeGuid} from "../../../framework.core/extras/utils/uniqueIdUtils";
import {ReportParamType} from "../../../app.core.api";

const serverUrl = process.env.REACT_APP_SERVER_URL;

export class MockReportProvider extends EntityProvider<ReportInfo> {
    baseUrl: string = `${serverUrl}/reports`;
    public static class: string = 'MockReportProvider';

    reportInfos: Record<string, ReportInfo> = {};
    index = 0;

    constructor() {
        super();
        super.appendClassName(MockReportProvider.class);
    }

    start() {
        super.start();
    }

    getAll(uiRequestData?: any): Promise<ReportInfo[]> {
        const me = this;
        return new Promise((resolve, reject) => {
            resolve(Object.values(me.reportInfos));
        });
    }

    getSingle(id: string): Promise<Nullable<ReportInfo>> {
        const me = this;
        return new Promise((resolve, reject) => {
            resolve(me.reportInfos[id] || null);
        });
    }

    remove(id: string): Promise<Nullable<ReportInfo>> {
        const me = this;
        return new Promise((resolve, reject) => {
            let result: Nullable<ReportInfo> = null;

            forEach(me.reportInfos, (reportInfo: ReportInfo) => {
                if (reportInfo.id == id) {
                    result = reportInfo;
                    return true;
                }
            });

            resolve(result);
        });
    }

    create(uiRequestData: ReportParamType, onUpdated?: (item: ReportInfo) => void): Promise<Nullable<ReportInfo>> {
        return new Promise((resolve, reject) => {
            const id = makeGuid();

            let reportInfo = new ReportInfo(id);

            const { title, pocket_id } = uiRequestData;

            if (title) {
                reportInfo.title = title;
            }

            if (pocket_id) {
                reportInfo.pocket_id = pocket_id;
            }

            resolve(reportInfo);
        });
    }

    update(id: string, partialParams: ReportParamType): Promise<Nullable<ReportInfo>> {
        const me = this;
        return new Promise((resolve, reject) => {
            const tmpReportInfo: ReportInfo = deepCopy(me.reportInfos[id]);

            if (partialParams.id) {
                delete partialParams.id;
            }

            const resultRecord: Record<string, any> = tmpReportInfo;
            const updateRecord: Record<string, any> = partialParams;

            forEachKVP(updateRecord, (key:string, newValue: any) => {
                resultRecord[key] = newValue;
            })

            me.reportInfos[id] = tmpReportInfo;

            resolve(tmpReportInfo);
        });
    }
}




