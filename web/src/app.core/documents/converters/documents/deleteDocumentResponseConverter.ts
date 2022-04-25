import {Converter} from "../../../common/converters/converter";
import {ResponseStatusType} from "../../../common/converters/types";

export class DeleteDocumentResponseConverter extends Converter<any, ResponseStatusType>{
    convert(fromData: any): any {

        const { detail, status, title, type:id } = fromData;

        return {
            detail,
            status,
            title,
            id
        };
    }
}
