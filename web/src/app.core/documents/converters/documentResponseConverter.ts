import {KM_API_SERVER_URL} from "../../../app.config/config";
import {getValueOrDefault} from "../../../framework.core/extras/utils/typeUtils";
import {DocumentInfo, StatusType} from "../../../app.model";
import {ErrorHandler} from "../../common/providers/entityProvider";
import {Converter} from "../../common/converters/converter";
import {getFormattedSize} from "../../../framework.core/extras/utils/sizeUtils";
import {forEach} from "../../../framework.core/extras/utils/collectionUtils";

export class DocumentResponseConverter extends Converter<any, DocumentInfo>{
    convert(fromData: any, reject: ErrorHandler): DocumentInfo {
        const item = fromData;

        const { detail } = item;

        if (detail) {
            reject(detail);
        }

        let idPropertyName: string = 'document_id';
        if (!item.hasOwnProperty('document_id')) {
            idPropertyName = 'id';
        }
        const documentInfo: DocumentInfo = new DocumentInfo(getValueOrDefault(item, idPropertyName, ''));

        documentInfo.author = getValueOrDefault(item, 'author', '');
        documentInfo.department = getValueOrDefault(item, 'department', '').toString();

        let public_tags: Record<string, string> = {};
        forEach(getValueOrDefault(item, 'custom_shared_tag', []), (tag: string) => {
            public_tags[tag] = tag;
        });

        let private_tags: Record<string, any> = {};
        forEach(getValueOrDefault(item, 'custom_personal_tag', []), (tags: Record<string, any>) => {
            let tagsArray: Record<string, string> = {};

            if (tags['tag_id'] && Array.isArray(tags['tag_id'])) {
                forEach(tags['tag_id'], (tag: string) => {
                    tagsArray[tag] = tag;
                })
            }

            private_tags[tags['user_id']] = tagsArray;
        })

        documentInfo.file_name = getValueOrDefault(item, 'file_name', '');
        documentInfo.file_page_count = getValueOrDefault(item, 'file_page_count', '');
        documentInfo.file_size = getFormattedSize(getValueOrDefault(item, 'file_size', ''));
        documentInfo.file_type = getValueOrDefault(item, 'file_type', '');
        documentInfo.primary_sme_email = getValueOrDefault(item, 'primary_sme_email', '');
        documentInfo.primary_sme_name = getValueOrDefault(item, 'primary_sme_name', '');
        documentInfo.primary_sme_phone = getValueOrDefault(item, 'primary_sme_phone', '');
        documentInfo.private_tag = private_tags;
        documentInfo.project = getValueOrDefault(item, 'project', '');
        documentInfo.public_tag = public_tags;
        documentInfo.publication_date = getValueOrDefault(item, 'publication_date', '');
        documentInfo.purpose = getValueOrDefault(item, 'purpose', '');
        documentInfo.secondary_sme_email = getValueOrDefault(item, 'secondary_sme_email', '');
        documentInfo.secondary_sme_name = getValueOrDefault(item, 'secondary_sme_name', '');
        documentInfo.secondary_sme_phone = getValueOrDefault(item, 'secondary_sme_phone', '');
        documentInfo.scope = getValueOrDefault(item, 'scope', '');
        documentInfo.title = getValueOrDefault(item, 'title', '');
        documentInfo.upload_date = getValueOrDefault(item, 'upload_date', '');
        documentInfo.uploadedBy_id = getValueOrDefault(item, 'uploaded_by', '');
        documentInfo.suggested_title = getValueOrDefault(item, 'tm_title', '');
        documentInfo.suggested_author = getValueOrDefault(item, 'tm_authors', '');
        documentInfo.suggested_publication_date = getValueOrDefault(item, 'tm_publication_date', '');

        documentInfo.suggested_locations = getValueOrDefault(item, 'tm_locations', '');
        documentInfo.suggested_organizations = getValueOrDefault(item, 'tm_organizations', '');
        documentInfo.suggested_references = getValueOrDefault(item, 'tm_references', '');
        documentInfo.suggested_topics = getValueOrDefault(item, 'tm_topics', '');

        let status = StatusType.PDF_AVAILABLE;

        let statusObject: any = {};

        if (item && item.hasOwnProperty("status")) {
            if (item["status"]) {

                if (typeof  item["status"] === "object") {
                    statusObject = item["status"];
                } else {
                    switch (item["status"]) {
                        case "failed":
                            status = StatusType.ERROR;
                            break;
                        default:
                            break;
                    }
                }
            }
        }

        if (Object.keys(statusObject).length !== 0) {
            const { stage, status:upload_status, version } = statusObject;

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
        }

        documentInfo.status = status;

        documentInfo.original_url = `${KM_API_SERVER_URL}/documents/${documentInfo.id}?format=ORIGINAL`;
        documentInfo.preview_url = `${KM_API_SERVER_URL}/documents/${documentInfo.id}?format=PREVIEW`;
        documentInfo.isUpdating = false;
        documentInfo.isUploading = !documentInfo.status;
        documentInfo.isPending = getValueOrDefault(item, 'tm_topics', '') === "Draft";

        return documentInfo;
    }
}
