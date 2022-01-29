import {makeGuid} from "../../../framework.visual/extras/utils/uniqueIdUtils";
import {TagInfo} from "../../../app";
import {Converter} from "../../common/converters/converter";

export class GetTagResponseConverter extends Converter<any, TagInfo> {
    convert(fromData: any, reject: any): TagInfo {
        return new TagInfo(
            makeGuid(),
            fromData
        );
    }
}
