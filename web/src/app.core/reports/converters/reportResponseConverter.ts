import {Converter} from "../../common/converters/converter";
import {CitationType, ReportInfo} from "../../../app.model";
import {getValueOrDefault} from "../../../framework.core/extras/utils/typeUtils";
import {forEach, forEachKVP} from "../../../framework.core/extras/utils/collectionUtils";

export class ReportResponseConverter extends Converter<any, ReportInfo> {
    convert(fromData: any, reject?: any, options?: any): ReportInfo {
        const item = fromData;

        const { detail } = item;

        if (detail) {
            reject(detail);
        }

        const reportInfo: ReportInfo = new ReportInfo(getValueOrDefault(item, 'pocket_id', getValueOrDefault(item, 'id', '')));

        reportInfo.title = getValueOrDefault(item, "title", "");
        reportInfo.author_id = getValueOrDefault(item, "author_id", "");
        reportInfo.creation_date = getValueOrDefault(item, "creation_date", "");
        reportInfo.publication_date = getValueOrDefault(item, "publication_date", "");
        reportInfo.scope = getValueOrDefault(item, "scope", "");
        reportInfo.value = getValueOrDefault(item, "rte_text", "");

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

        reportInfo.isUpdating = false;

        return reportInfo;
    }

}
