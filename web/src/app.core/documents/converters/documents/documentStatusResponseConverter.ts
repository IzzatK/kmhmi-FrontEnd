import {Converter} from "../../../common/converters/converter";
import {ResponseStatusType} from "../../../common/converters/types";
import {ErrorHandler} from "../../../common/providers/entityProvider";

export class DocumentStatusResponseConverter extends Converter<any, ResponseStatusType>{
    convert(fromData: any, reject: ErrorHandler): ResponseStatusType {

        const { detail, status, title, type:id } = fromData;

        return {
            detail,
            status,
            title,
            id
        };
    }
}
