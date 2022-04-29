import {Converter} from "../../../common/converters/converter";
import {ResponseStatusType} from "../../../common/converters/types";
import {StatusType} from "../../../../app.model";

export class UploadDocumentResponseConverter extends Converter<any, ResponseStatusType>{
    convert(fromData: any): ResponseStatusType {

        const { detail, status: statusObject, title, type:id } = fromData;
        const { stage, status:upload_status, version } = statusObject;

        let status: StatusType;

        switch (stage) {
            case stage < 10:
                status = StatusType.CREATED;
                break;
            case stage < 20:
                status = StatusType.PDF_AVAILABLE;
                break;
            case stage < 30:
                status = StatusType.SEARCHABLE;
                break;
            default:
                status = StatusType.NLP_COMPLETE;
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
