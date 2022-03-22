import {Converter} from "../../../common/converters/converter";
import {PocketInfo,} from "../../../../app.model";
import {forEachKVP} from "../../../../framework.core/extras/utils/collectionUtils";
import {PocketParamType} from "../../../../app.core.api";

export class CreatePocketRequestConverter extends Converter<PocketParamType, any> {

    convert(fromData: PocketParamType): any {
        const pocketInfo = fromData;

        const PocketProperties: Partial<Record<keyof PocketInfo, any>> = {
            id: "pocket_id",
            title: "title",
            author_id: "author_id",
            note_ids: "note_ids",
        }

        let serverPocket: Record<string, any> = {};

        forEachKVP(pocketInfo, (itemKey: keyof PocketInfo, itemValue: any) => {
            let serverPocketKey = PocketProperties[itemKey]?.toString();

            if (serverPocketKey) {
                if (itemValue !== "") {
                    serverPocket[serverPocketKey] = itemValue;
                }
            }
        });

        return serverPocket;
    }
}
