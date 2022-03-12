import {forEachKVP} from "../../../framework.visual/extras/utils/collectionUtils";
import {IConverter} from "../../../framework.api";
import {TagInfo} from "../../../app.model";
import {Nullable} from "../../../framework.core/extras/typeUtils";
import {Converter} from "../../common/converters/converter";

export class GetTagArrayResponseConverter extends Converter<any,TagInfo[]>{

    private _singleConverter!: IConverter<any, Nullable<TagInfo>>;

    convert(fromData: any, reject: any): TagInfo[] {

        const result: TagInfo[] = [];

        if (Array.isArray(fromData)) {
            forEachKVP(fromData, (itemKey:string, itemValue: string[]) => {
                let tagInfo = this._singleConverter.convert(itemValue, reject);

                if (tagInfo != null) {
                    result.push(tagInfo);
                }
            });
        }
        else {
            reject('Error while parsing array of tags. Expected Array. Receive the following: <' + fromData + '>');
        }

        return result;
    }

    get singleConverter(): IConverter<any, Nullable<TagInfo>> {
        return this._singleConverter;
    }

    set singleConverter(value: IConverter<any, Nullable<TagInfo>>) {
        this._singleConverter = value;
    }
}
