import {Converter} from "../../common/converters/converter";
import {ReportInfo} from "../../../app.model";
import {IConverter} from "../../../framework.core.api";
import {Nullable} from "../../../framework.core/extras/utils/typeUtils";
import {forEachKVP} from "../../../framework.core/extras/utils/collectionUtils";

export class GetReportArrayResponseConverter extends Converter<any, ReportInfo[]> {

    private _singleConverter!: IConverter<any, Nullable<ReportInfo>>;

    convert(fromData: any, reject?: any): ReportInfo[] {
        const result: ReportInfo[] = [];

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

    get singleConverter(): IConverter<any, Nullable<ReportInfo>> {
        return this._singleConverter;
    }

    set singleConverter(value: IConverter<any, Nullable<ReportInfo>>) {
        this._singleConverter = value;
    }
}
