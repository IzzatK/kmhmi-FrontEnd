import {ResponseStatusType} from "../../common/converters/types";
import {Converter} from "../../common/converters/converter";

export class UploadDocumentResponseConverter extends Converter<any, ResponseStatusType>{
    convert(fromData: any): ResponseStatusType {

        const { document_id:id, status } = fromData;

        return {
            id,
            status
        };
    }
}
