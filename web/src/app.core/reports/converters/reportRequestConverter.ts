import {Converter} from "../../common/converters/converter";
import {ReportInfo} from "../../../app.model";
import {forEachKVP} from "../../../framework.core/extras/utils/collectionUtils";

export class ReportRequestConverter extends Converter<any, any> {
    convert(fromData: any, reject?: any, options?: any): any {
        const reportInfo = fromData;

        const ReportProperties: Partial<Record<keyof ReportInfo, any>> = {
            author_id: "author_id",
            title: "title",
            creation_date: "creation_date",
            publication_date: "publication_date",
            citation: "citation",
            value: "rte_text",
            scope: "scope",
            private_tag: "custom_personal_tag",
            public_tag: "custom_shared_tag",
            resource_ids: "resources",
        }

        let serverReport: Record<string, any> = {};

        forEachKVP(reportInfo, (itemKey: keyof ReportInfo, itemValue: any) => {
            let serverReportKey = ReportProperties[itemKey]?.toString();

            if (serverReportKey) {
                if (itemValue !== "") {
                    if (itemKey === "public_tag") {
                        let tagsArray: string[] = [];
                        forEachKVP(itemValue, (item: string) => {
                            if (item !== "") {
                                tagsArray.push(item);
                            }
                        })
                        serverReport[serverReportKey] = tagsArray;
                    } else if (itemKey === "private_tag") {
                        let tagsArray: any[] = [];
                        forEachKVP(itemValue, (itemKey: string, itemValue: Record<string, string>) => {
                            let tagObject: Record<string, any> = {};

                            let itemValueArray: string[] = [];
                            if (itemValue) {
                                forEachKVP(itemValue, (item: string) => {
                                    itemValueArray.push(item);
                                })
                            }

                            tagObject['tag_id'] = itemValueArray;
                            tagObject['user_id'] = itemKey;

                            tagsArray.push(tagObject);
                        })
                        serverReport[serverReportKey] = tagsArray;
                    } else if (itemKey === "citation") {
                        serverReport[serverReportKey] = itemValue.toString();//TODO this may not be correct
                    } else if (itemKey === "resource_ids") {
                        let resourcesArray: any[] = [];

                        itemValue.map((resource_id: string) => {
                            resourcesArray.push({resource_id});
                        })
                        serverReport[serverReportKey] = resourcesArray;
                    } else {
                        serverReport[serverReportKey] = itemValue;
                    }
                }
            }
        });

        return serverReport;
    }

}
