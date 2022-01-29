import {IConverter} from "../../../../core.api";
import {forEachKVP} from "../../../../framework.visual/extras/utils/collectionUtils";
import {UserInfo} from "../../../../model";
import {Converter} from "../../../common/converters/converter";
import {Nullable} from "../../../../framework/extras/typeUtils";

export class GetUserArrayResponseConverter extends Converter<any,UserInfo[]> {

    private _singleConverter!: IConverter<any, Nullable<UserInfo>>;

    convert(fromData: any, reject?: any): UserInfo[] {
        const result: UserInfo[] = [];

        if (Array.isArray(fromData[0])) {
            forEachKVP(fromData[0], (itemKey:string, itemValue: string[]) => {
                let model = this._singleConverter.convert(itemValue, reject);

                if (model != null) {
                    result.push(model);
                }
            });
        }
        else {
            if (fromData === 'User waiting for approval by KM Admin') {
                window.alert(fromData);
            }
            reject('Error while parsing array of users. Expected Array. Receive the following: <' + fromData + '>');
        }


        return result;
    }

    get singleConverter(): IConverter<any, Nullable<UserInfo>> {
        return this._singleConverter;
    }

    set singleConverter(value: IConverter<any, Nullable<UserInfo>>) {
        this._singleConverter = value;
    }
}
