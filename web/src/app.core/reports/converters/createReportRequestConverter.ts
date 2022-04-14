import {ReportParamType} from "../../../app.core.api";
import {ReportInfo} from "../../../app.model";
import {Converter} from "../../common/converters/converter";
import {forEachKVP} from "../../../framework.core/extras/utils/collectionUtils";

export class CreateReportRequestConverter extends Converter<ReportParamType, any> {

    convert(fromData: ReportParamType): any {
        const reportInfo = fromData;

        const ReportProperties: Partial<Record<keyof ReportInfo, any>> = {
            title: "title",
            author_id: "author_id",
        }

        let serverReport: Record<string, any> = {};

        forEachKVP(reportInfo, (itemKey: keyof ReportInfo, itemValue: any) => {
            let serverReportKey = ReportProperties[itemKey]?.toString();

            if (serverReportKey) {
                if (itemValue !== "") {
                    serverReport[serverReportKey] = itemValue;
                }
            }
        });

        serverReport["plain_text"] = "";
        serverReport["rte_text"] = JSON.stringify([{children: [{ text: "" },],}]);

        return serverReport;
    }
}
