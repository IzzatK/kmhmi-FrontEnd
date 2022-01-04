import {KM_API_SERVER_URL} from "../../../config/config";
import {getValueOrDefault} from "../../../framework/extras/typeUtils";
import {DocumentInfo} from "../../../model";
import {ErrorHandler} from "../../common/providers/entityProvider";
import {Converter} from "../../common/converters/converter";

export class GetDocumentResponseConverter extends Converter<any, DocumentInfo>{
    convert(fromData: any, reject: ErrorHandler): DocumentInfo {
        const item = fromData;

        const documentInfo: DocumentInfo = new DocumentInfo(getValueOrDefault(item, 'document_id', ''));

        documentInfo.author = getValueOrDefault(item, 'author', '');

        if (item['dept_id']) {
            documentInfo.department = getValueOrDefault(item, 'dept_id', '');
        }
        else if (item['department']) {
            documentInfo.department = getValueOrDefault(item, 'department', '');
        }

        documentInfo.file_name = getValueOrDefault(item, 'file_name', '');
        documentInfo.file_page_count = getValueOrDefault(item, 'file_page_count', '');
        documentInfo.file_size = getValueOrDefault(item, 'file_size', '');
        documentInfo.file_type = getValueOrDefault(item, 'file_type', '');
        documentInfo.primary_sme_email = getValueOrDefault(item, 'primary_sme_email', '');
        documentInfo.primary_sme_name = getValueOrDefault(item, 'primary_sme_name', '');
        documentInfo.primary_sme_phone = getValueOrDefault(item, 'primary_sme_phone', '');
        documentInfo.private_tag = getValueOrDefault(item, 'custom_personal_tag', []);
        documentInfo.project = getValueOrDefault(item, 'project', '');
        documentInfo.public_tag = getValueOrDefault(item, 'custom_shared_tag', []);
        documentInfo.publication_date = getValueOrDefault(item, 'publication_date', '');
        documentInfo.purpose = getValueOrDefault(item, 'purpose', '');
        documentInfo.secondary_sme_email = getValueOrDefault(item, 'secondary_sme_email', '');
        documentInfo.secondary_sme_name = getValueOrDefault(item, 'secondary_sme_name', '');
        documentInfo.secondary_sme_phone = getValueOrDefault(item, 'secondary_sme_phone', '');
        documentInfo.status = getValueOrDefault(item, 'status', '');
        documentInfo.title = getValueOrDefault(item, 'title', '');
        documentInfo.upload_date = getValueOrDefault(item, 'upload_date', '');
        documentInfo.uploadedBy_id = getValueOrDefault(item, 'uploaded_by', '');


        documentInfo.original_url = `${KM_API_SERVER_URL}/documents/${documentInfo.id}?format=ORIGINAL`;
        documentInfo.preview_url = `${KM_API_SERVER_URL}/documents/${documentInfo.id}?format=PREVIEW`;
        documentInfo.isUpdating = false;
        documentInfo.isUploading = !documentInfo.status;

        return documentInfo;
    }
}
