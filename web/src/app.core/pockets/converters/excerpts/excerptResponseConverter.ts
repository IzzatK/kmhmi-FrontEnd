import {Converter} from "../../../common/converters/converter";
import {ExcerptInfo} from "../../../../app.model";
import {getValueOrDefault} from "../../../../framework.core/extras/utils/typeUtils";

export class ExcerptResponseConverter extends Converter<any, ExcerptInfo> {
    convert(fromData: any, reject?: any, options?: any): ExcerptInfo {

        const item = fromData;

        const excerptInfo = new ExcerptInfo(getValueOrDefault(item, "excerpt_id", ""));

        excerptInfo.content = getValueOrDefault(item, "rte_text", "");
        excerptInfo.authorId = getValueOrDefault(item, "author_id", "");
        excerptInfo.text = getValueOrDefault(item, "plain_text", "");
        excerptInfo.location = getValueOrDefault(item, "location", "");
        excerptInfo.noteIds = getValueOrDefault(item, "note_ids", []);

        return excerptInfo;
    }
}
