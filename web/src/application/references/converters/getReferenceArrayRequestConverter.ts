import {Converter} from "../../common/converters/converter";


export class GetReferenceArrayRequestConverter extends Converter<any, any>{
    convert(uiRequestData: {id:string}): any {
        return `?type=${uiRequestData.id}`;
    }
}
