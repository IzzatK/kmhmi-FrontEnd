import {Converter} from "../../common/converters/converter";


export class GetPermissionArrayRequestConverter extends Converter<any, any>{
    convert(uiRequestData: {userId:string}): any {
        return `/${uiRequestData.userId}`;
    }
}
