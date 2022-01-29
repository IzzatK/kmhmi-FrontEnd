import {ErrorHandler} from "../../common/providers/entityProvider";
import {ResponseStatusType} from "../../common/converters/types";
import {Converter} from "../../common/converters/converter";

export class DocumentResponseConverter extends Converter<any, ResponseStatusType>{
    convert(fromData: any, reject: ErrorHandler): ResponseStatusType {

        const { id:id, message:status } = fromData;

        return {
            id,
            status
        };
    }
}
