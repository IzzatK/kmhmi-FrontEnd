import {Converter} from "../../../common/converters/converter";
import {ResponseStatusType} from "../../../common/converters/types";

export class DeleteUserResponseConverter extends Converter<any,ResponseStatusType>{
    convert(fromData: any): any {

        const { user_id:id, status } = fromData;

        return {
            id,
            status
        };
    }
}
