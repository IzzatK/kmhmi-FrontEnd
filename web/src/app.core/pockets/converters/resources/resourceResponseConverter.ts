import {Converter} from "../../../common/converters/converter";
import {ResourceInfo} from "../../../../app.model";
import {getValueOrDefault} from "../../../../framework.core/extras/utils/typeUtils";

export class ResourceResponseConverter extends Converter<any, ResourceInfo> {
    convert(fromData: any, reject?: any, options?: any): ResourceInfo {

        const item = fromData;

        const resourceInfo = new ResourceInfo(getValueOrDefault(item, "resource_id", ""));

        resourceInfo.title = getValueOrDefault(item, "title", "");
        resourceInfo.excerptIds = getValueOrDefault(item, "excerpt_ids", []);
        resourceInfo.author_id = getValueOrDefault(item, "author_id", "");
        resourceInfo.note_ids = getValueOrDefault(item, "note_ids", []);

        return resourceInfo;
    }
}
