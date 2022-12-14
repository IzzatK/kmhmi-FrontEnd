import {IConverter} from "../../../../framework.core.api";
import {forEachKVP} from "../../../../framework.core/extras/utils/collectionUtils";
import {UserInfo} from "../../../../app.model";
import {Converter} from "../../../common/converters/converter";
import {Nullable} from "../../../../framework.core/extras/utils/typeUtils";

export class GetUserArrayResponseConverter extends Converter<any,UserInfo[]> {

    private _singleConverter!: IConverter<any, Nullable<UserInfo>>;

    convert(fromData: any, reject?: any): UserInfo[] {
        const result: UserInfo[] = [];

        if (Array.isArray(fromData)) {
            forEachKVP(fromData, (itemKey:string, itemValue: string[]) => {
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
