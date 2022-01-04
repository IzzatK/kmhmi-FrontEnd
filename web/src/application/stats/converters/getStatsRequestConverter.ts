import {Converter} from "../../common/converters/converter";

export class GetStatsRequestConverter extends Converter<any, any>{
    convert(uiRequestData?: any): any {
        return uiRequestData;
    }
}
