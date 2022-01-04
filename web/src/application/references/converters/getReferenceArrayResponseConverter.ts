import {forEachKVP} from "../../../framework.visual/extras/utils/collectionUtils";
import {ReferenceType} from "../../../model";
import {ReferenceInfo} from "../../../model";
import {Converter} from "../../common/converters/converter";

export class GetReferenceArrayResponseConverter extends Converter<any, ReferenceInfo[]>{
    convert(fromData: any, reject: any, options?: {referenceType: ReferenceType}): ReferenceInfo[] {
        if (!Array.isArray(fromData)) {
            reject('Error while parsing array of references. Expected Array. Receive the following: <' + fromData + '>');
        }

        let result: ReferenceInfo[] = [];

        if (options != null) {
            const referenceOrdinal = ReferenceType[options.referenceType];

            forEachKVP(fromData, (key: string, value: any) => {

                const {id, name} = value;

                const info: ReferenceInfo = new ReferenceInfo(
                    id,
                    name,
                    referenceOrdinal
                )

                result.push(info);
            })
        }

        return result;
    }
}
