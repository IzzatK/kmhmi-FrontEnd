import {Converter} from "../../common/converters/converter";
import {CitationType, ReportInfo} from "../../../app.model";
import {getValueOrDefault} from "../../../framework.core/extras/utils/typeUtils";
import {forEach, forEachKVP} from "../../../framework.core/extras/utils/collectionUtils";
import {KM_API_SERVER_URL} from "../../../app.config/config";

export class ReportResponseConverter extends Converter<any, ReportInfo> {
    convert(fromData: any, reject?: any, options?: any): ReportInfo {
        const item = fromData;

        const { detail } = item;

        if (detail) {
            reject(detail);
        }

        const reportInfo: ReportInfo = new ReportInfo(getValueOrDefault(item, 'report_id', getValueOrDefault(item, 'id', '')));

        reportInfo.title = getValueOrDefault(item, "title", "");
        reportInfo.author_id = getValueOrDefault(item, "author_id", "");
        reportInfo.upload_date = getValueOrDefault(item, "upload_date", "");
        reportInfo.publication_date = getValueOrDefault(item, "publication_date", "");
        reportInfo.scope = getValueOrDefault(item, "scope", "");
        reportInfo.uploadedBy_id = getValueOrDefault(item, "uploaded_by", "");

        let content = [{children: [{ text: "" },],}];

        try {
            content = JSON.parse(getValueOrDefault(item, "rte_text", "[{\"children\":[{\"text\":\"\"}]}]"));
        } catch (error) {
            console.log(error);
        }

        reportInfo.content = content;

        let public_tags: Record<string, string> = {};
        forEach(getValueOrDefault(item, 'custom_shared_tag', []), (tag: string) => {
            public_tags[tag] = tag;
        });

        let private_tags: Record<string, any> = {};
        forEach(getValueOrDefault(item, 'custom_personal_tag', []), (tags: Record<string, any>) => {
            let tagsArray: Record<string, string> = {};

            if (tags['tag_id'] && Array.isArray(tags['tag_id'])) {
                forEach(tags['tag_id'], (tag: string) => {
                    tagsArray[tag] = tag;
                })
            }

            private_tags[tags['user_id']] = tagsArray;
        })
        reportInfo.private_tag = private_tags;
        reportInfo.public_tag = public_tags;

        let resource_ids: string[] = [];

        forEachKVP(getValueOrDefault(item, 'resources', []), (resource: any) => {
            resource_ids.push(resource['resource_id']);
        })

        reportInfo.resource_ids = resource_ids;

        let citation = CitationType.MLA;

        switch (getValueOrDefault(item, "citation", "")) {
            case "Chicago":
                citation = CitationType.CHICAGO;
                break;
            case "Harvard":
                citation = CitationType.Harvard;
                break;
            case "APA":
                citation = CitationType.APA;
                break;
        }
        reportInfo.citation = citation;

        reportInfo.original_url = `${KM_API_SERVER_URL}/pockets/reports/${reportInfo.id}?format=ORIGINAL`;
        reportInfo.preview_url = `${KM_API_SERVER_URL}/pockets/reports/${reportInfo.id}?format=PREVIEW`;

        reportInfo.isUpdating = false;

        return reportInfo;
    }

}
