import {Converter} from "../../../common/converters/converter";
import {forEachKVP} from "../../../../framework.core/extras/utils/collectionUtils";
import {ExcerptInfo} from "../../../../app.model";

export class ExcerptRequestConverter extends Converter<ExcerptInfo, any> {

    convert(fromData: ExcerptInfo, reject?: any, options?: any): any {

        const ExcerptProperties: Partial<Record<keyof ExcerptInfo, string>> = {
            id: "excerpt_id",
            text: "plain_text",
            content: "rte_text",
            authorId: "author_id",
            location: "location",
            noteIds: "note_ids",
        }

        let serverExcerpt: Record<string, string> = {};

        forEachKVP(fromData, (itemKey: keyof ExcerptInfo, itemValue: any) => {
            let serverExcerptKey = ExcerptProperties[itemKey]?.toString();

            if (serverExcerptKey) {
                if (itemValue !== "") {
                    serverExcerpt[serverExcerptKey] = itemValue;
                }
            }
        });

        return serverExcerpt;
    }
}
