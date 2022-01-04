import {ErrorHandler} from "../../../common/providers/entityProvider";
import {ResponseStatusType} from "../../../common/converters/types";
import {Converter} from "../../../common/converters/converter";

export class UserStatusResponseConverter extends Converter<any, ResponseStatusType>{
    convert(fromData: any, reject: ErrorHandler): ResponseStatusType {

        const { user_id:id, status } = fromData;

        return {
            id,
            status
        };
    }
}
