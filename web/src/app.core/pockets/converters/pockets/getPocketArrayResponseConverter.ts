import {IConverter} from "../../../../framework.core.api";
import {forEachKVP} from "../../../../framework.core/extras/utils/collectionUtils";
import {PocketMapper} from "../../../../app.model";
import {Converter} from "../../../common/converters/converter";
import {Nullable} from "../../../../framework.core/extras/utils/typeUtils";

export class GetPocketArrayResponseConverter extends Converter<any, PocketMapper[]> {

    private _singleConverter!: IConverter<any, Nullable<PocketMapper>>;

    convert(fromData: any, reject?: any): PocketMapper[] {
        const result: PocketMapper[] = [];

        if (Array.isArray(fromData)) {
            forEachKVP(fromData, (itemKey:string, itemValue: string[]) => {
                let model = this._singleConverter.convert(itemValue, reject);

                if (model != null) {
                    result.push(model);
                }
            });
        }
        else {
            reject('Error while parsing array of pockets. Expected Array. Receive the following: <' + fromData + '>');
        }

        return result;
    }

    get singleConverter(): IConverter<any, Nullable<PocketMapper>> {
        return this._singleConverter;
    }

    set singleConverter(value: IConverter<any, Nullable<PocketMapper>>) {
        this._singleConverter = value;
    }
}
