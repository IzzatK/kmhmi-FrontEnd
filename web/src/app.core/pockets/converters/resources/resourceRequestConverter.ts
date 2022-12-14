import {Converter} from "../../../common/converters/converter";
import {forEachKVP} from "../../../../framework.core/extras/utils/collectionUtils";
import {ResourceInfo} from "../../../../app.model";

export class ResourceRequestConverter extends Converter<ResourceInfo, any> {

    convert(fromData: ResourceInfo, reject?: any, options?: any): any {

        const ResourceProperties: Partial<Record<keyof ResourceInfo, string>> = {
            id: "resource_id",
            title: "title",
            author_id: "author_id",
            excerptIds: "excerpt_ids",
            note_ids: "note_ids",
        }

        let serverResource: Record<string, string> = {};

        forEachKVP(fromData, (itemKey: keyof ResourceInfo, itemValue: any) => {
            let serverResourceKey = ResourceProperties[itemKey]?.toString();

            if (serverResourceKey) {
                if (itemValue !== "") {
                    serverResource[serverResourceKey] = itemValue;
                }
            }
        });

        return serverResource;
    }
}
