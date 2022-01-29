import {Converter} from "../../common/converters/converter";

export class GetTagArrayRequestConverter extends Converter<any, any>{
    convert(uiRequestData?: any): any {
        return uiRequestData;
    }
}
