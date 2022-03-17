import {ErrorHandler} from "../../../common/providers/entityProvider";
import {ResponseStatusType} from "../../../common/converters/types";
import {Converter} from "../../../common/converters/converter";

export class PocketStatusResponseConverter extends Converter<any, ResponseStatusType>{
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
