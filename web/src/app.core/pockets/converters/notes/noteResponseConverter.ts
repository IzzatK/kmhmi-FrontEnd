import {Converter} from "../../../common/converters/converter";
import {NoteInfo} from "../../../../app.model";
import {getValueOrDefault} from "../../../../framework.core/extras/utils/typeUtils";

export class NoteResponseConverter extends Converter<any, NoteInfo> {
    convert(fromData: any, reject?: any, options?: any): NoteInfo {

        const item = fromData;

        const noteInfo = new NoteInfo(getValueOrDefault(item, "note_id", ""));

        noteInfo.content = getValueOrDefault(item, "rte_text", "");
        noteInfo.author_id = getValueOrDefault(item, "author_id", "");
        noteInfo.text = getValueOrDefault(item, "plain_text", "");

        return noteInfo;
    }
}
