import {nameOf} from "../../../framework/extras/typeUtils";
import {DocumentInfo} from "../../../model";
import {Converter} from "../../common/converters/converter";

export class UpdateDocumentRequestConverter extends Converter<any, any>{

    convert(fromData: { id: string, latestDocument: DocumentInfo, modifiedDocument: Record<string, any> }): any {

        const { id, latestDocument, modifiedDocument={} } = fromData;

        const dictionary: Record<string, any> = latestDocument;

        const getTextValueOrDefault = (propertyName: string, defaultValue: any) => {
            let result = defaultValue;
            if (modifiedDocument[propertyName]) {
                result =  modifiedDocument[propertyName];
            }
            else if (dictionary[propertyName])
            {
                result = dictionary[propertyName];
            }
            return result;
        }

        let serverDoc = {
            id: id,
            author: getTextValueOrDefault(nameOf<DocumentInfo>('author'), ''),
            custom_personal_tag: getTextValueOrDefault(nameOf<DocumentInfo>('private_tag'), ''),
            custom_shared_tag: getTextValueOrDefault(nameOf<DocumentInfo>('public_tag'), ''),
            department: getTextValueOrDefault(nameOf<DocumentInfo>('department'), ''),
            dept_id: getTextValueOrDefault(nameOf<DocumentInfo>('department'), ''),
            file_name: getTextValueOrDefault(nameOf<DocumentInfo>('file_name'), ''),
            file_page_count: getTextValueOrDefault(nameOf<DocumentInfo>('file_page_count'), ''),
            file_size: getTextValueOrDefault(nameOf<DocumentInfo>('file_size'), ''),
            file_type: getTextValueOrDefault(nameOf<DocumentInfo>('file_type'), ''),

            primary_sme_email: getTextValueOrDefault(nameOf<DocumentInfo>('primary_sme_email'), ''),
            primary_sme_name: getTextValueOrDefault(nameOf<DocumentInfo>('primary_sme_name'), ''),
            primary_sme_phone: getTextValueOrDefault(nameOf<DocumentInfo>('primary_sme_phone'), ''),
            project: getTextValueOrDefault(nameOf<DocumentInfo>('project'), ''),
            publication_date: getTextValueOrDefault(nameOf<DocumentInfo>('publication_date'), ''),
            purpose: getTextValueOrDefault(nameOf<DocumentInfo>('purpose'), ''),

            secondary_sme_email: getTextValueOrDefault(nameOf<DocumentInfo>('secondary_sme_email'), ''),
            secondary_sme_name: getTextValueOrDefault(nameOf<DocumentInfo>('secondary_sme_name'), ''),
            secondary_sme_phone: getTextValueOrDefault(nameOf<DocumentInfo>('secondary_sme_phone'), ''),
            status: getTextValueOrDefault(nameOf<DocumentInfo>('status'), ''),
            title: getTextValueOrDefault(nameOf<DocumentInfo>('title'), ''),
            upload_date: getTextValueOrDefault(nameOf<DocumentInfo>('upload_date'), ''),
            uploaded_by: getTextValueOrDefault(nameOf<DocumentInfo>('uploadedBy_id'), ''),
        }

        return serverDoc;
    }
}
