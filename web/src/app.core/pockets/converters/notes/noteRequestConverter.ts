import {Converter} from "../../../common/converters/converter";
import {forEachKVP} from "../../../../framework.core/extras/utils/collectionUtils";
import {NoteInfo} from "../../../../app.model";

export class NoteRequestConverter extends Converter<NoteInfo, any> {

    convert(fromData: NoteInfo, reject?: any, options?: any): any {

        const NoteProperties: Partial<Record<keyof NoteInfo, string>> = {
            id: "note_id",
            text: "plain_text",
            content: "rte_text",
            author_id: "author_id",
        }

        let serverNote: Record<string, string> = {};

        forEachKVP(fromData, (itemKey: keyof NoteInfo, itemValue: any) => {
            let serverNoteKey = NoteProperties[itemKey]?.toString();

            if (serverNoteKey) {
                if (itemValue !== "") {
                    serverNote[serverNoteKey] = itemValue;
                }
            }
        });

        return serverNote;
    }
}
