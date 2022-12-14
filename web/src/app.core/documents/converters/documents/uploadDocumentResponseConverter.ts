import {Converter} from "../../../common/converters/converter";
import {ResponseStatusType} from "../../../common/converters/types";
import {StatusType} from "../../../../app.model";

export class UploadDocumentResponseConverter extends Converter<any, ResponseStatusType>{
    convert(fromData: any): ResponseStatusType {

        const { detail, status: statusObject, title, type:id } = fromData;
        const { stage, status:upload_status, version } = statusObject;

        let status: StatusType;

        if (stage <= 10) {
            status = StatusType.CREATED;
        } else if (stage <= 20) {
            status = StatusType.PDF_AVAILABLE;
        } else if (stage <= 30) {
            status = StatusType.SEARCHABLE;
        } else if (stage > 30) {
            status = StatusType.NLP_COMPLETE;
        } else {
            status = StatusType.PROCESSING;
        }

        return {
            detail,
            status,
            title,
            id
        };
    }
}
