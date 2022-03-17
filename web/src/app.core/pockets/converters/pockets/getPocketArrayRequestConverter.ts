import {Converter} from "../../../common/converters/converter";

export class GetPocketArrayRequestConverter extends Converter<any, any> {
    convert(uiRequestData?: string): any {
        return `/search?search_keyword=${uiRequestData}`;
    }
}
