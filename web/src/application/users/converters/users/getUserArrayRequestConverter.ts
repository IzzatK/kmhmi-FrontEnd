import {Converter} from "../../../common/converters/converter";

export class GetUserArrayRequestConverter extends Converter<any,any>{
    convert(uiRequestData?: string): any {
        return `/search?search_keyword=${uiRequestData}`;
    }
}
