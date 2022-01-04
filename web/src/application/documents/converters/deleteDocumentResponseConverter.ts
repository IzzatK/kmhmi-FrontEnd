import {Converter} from "../../common/converters/converter";
import {ResponseStatusType} from "../../common/converters/types";

export class DeleteDocumentResponseConverter extends Converter<any, ResponseStatusType>{
    convert(fromData: any): any {

        const { document_id, status } = fromData;

        return {
            id: document_id,
            status
        };
    }
}
