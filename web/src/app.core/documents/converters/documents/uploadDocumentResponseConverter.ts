import {Converter} from "../../../common/converters/converter";
import {ResponseStatusType} from "../../../common/converters/types";
import {StatusType} from "../../../../app.model";

export class UploadDocumentResponseConverter extends Converter<any, ResponseStatusType>{
    convert(fromData: any): ResponseStatusType {

        const { detail, status: statusObject, title, type:id } = fromData;
        const { stage, status:upload_status, version } = statusObject;

        let status = StatusType.PROCESSING;

        switch (stage) {
            case 0:
                status = StatusType.CREATED;
                break;
            case 10:
                status = StatusType.PDF_AVAILABLE;
                break;
            case 20:
                status = StatusType.SEARCHABLE;
                break;
            case 30:
                status = StatusType.NLP_COMPLETE;
                break;
            default:
                break;
        }

        return {
            detail,
            status,
            title,
            id
        };
    }
}