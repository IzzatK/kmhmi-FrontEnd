import {nameOf} from "../../../framework.core/extras/utils/typeUtils";
import {DocumentInfo} from "../../../app.model";
import {Converter} from "../../common/converters/converter";
import {forEachKVP} from "../../../framework.core/extras/utils/collectionUtils";

export class UpdateDocumentRequestConverter extends Converter<any, any>{

    convert(fromData: { id: string, latestDocument: DocumentInfo, modifiedDocument: Record<string, any> }): any {

        const { id, latestDocument, modifiedDocument={} } = fromData;

        const dictionary: Record<string, any> = latestDocument;

        let numValues = ["dept_id", "department"];

        const getTextValueOrDefault = (propertyName: string, defaultValue: any) => {
            let result = defaultValue;
            if (modifiedDocument[propertyName]) {
                if (propertyName === "public_tag") {
                    let tagsArray: string[] = [];
                    forEachKVP(modifiedDocument[propertyName], (item: string) => {
                        if (item !== "") {
                            tagsArray.push(item);
                        }
                    })
                    result = tagsArray;
                } else if (propertyName === "private_tag") {
                    let tagsArray: any[] = [];
                    forEachKVP(modifiedDocument[propertyName], (itemKey: string, itemValue: Record<string, string>) => {
                        let tagObject: Record<string, any> = {};

                        let itemValueArray: string[] = [];
                        if (itemValue) {
                            forEachKVP(itemValue, (item: string) => {
                                itemValueArray.push(item);
                            })
                        }

                        tagObject['tag_id'] = itemValueArray;
                        tagObject['user_id'] = itemKey;

                        tagsArray.push(tagObject);
                    })
                    result = tagsArray;
                } else if (propertyName === "status") {
                    result = modifiedDocument[propertyName] !== "Private" ? "Public" : modifiedDocument[propertyName];
                } else {
                    result =  modifiedDocument[propertyName];
                }
            }
            else if (dictionary[propertyName]) {
                if (propertyName === "public_tag") {
                    let tagsArray: string[] = [];
                    forEachKVP(dictionary[propertyName], (item: string) => {
                        if (item !== "") {
                            tagsArray.push(item);
                        }
                    })
                    result = tagsArray;
                } else if (propertyName === "private_tag") {
                    let tagsArray: any[] = [];
                    forEachKVP(dictionary[propertyName], (itemKey: string, itemValue: Record<string, string>) => {
                        let tagObject: Record<string, any> = {};

                        let itemValueArray: string[] = [];
                        if (itemValue) {
                            forEachKVP(itemValue, (item: string) => {
                                itemValueArray.push(item);
                            })
                        }

                        tagObject['tag_id'] = itemValueArray;
                        tagObject['user_id'] = itemKey;

                        tagsArray.push(tagObject);
                    })
                    result = tagsArray;
                } else if (propertyName === "status") {
                    result = dictionary[propertyName] !== "Private" ? "Public" : dictionary[propertyName];
                } else {
                    result = dictionary[propertyName];
                }
            }

            //convert id to number
            let convertToInt = false;

            numValues.map((item: string) => {
                if (item === propertyName) {
                    convertToInt = true;
                }
            });

            if (convertToInt) {
                return parseInt(result);
            } else {
                return result;
            }
        }

        let serverDoc = {
            id: id,
            author: getTextValueOrDefault(nameOf<DocumentInfo>('author'), ''),
            custom_personal_tag: getTextValueOrDefault(nameOf<DocumentInfo>('private_tag'), []),
            custom_shared_tag: getTextValueOrDefault(nameOf<DocumentInfo>('public_tag'), []),
            department: getTextValueOrDefault(nameOf<DocumentInfo>('department'), null),
            // dept_id: getTextValueOrDefault(nameOf<DocumentInfo>('department'), null),
            file_name: getTextValueOrDefault(nameOf<DocumentInfo>('file_name'), ''),
            file_page_count: getTextValueOrDefault(nameOf<DocumentInfo>('file_page_count'), ''),
            file_size: getTextValueOrDefault(nameOf<DocumentInfo>('file_size'), ''),
            file_type: getTextValueOrDefault(nameOf<DocumentInfo>('file_type'), ''),

            primary_sme_email: getTextValueOrDefault(nameOf<DocumentInfo>('primary_sme_email'), ''),
            primary_sme_name: getTextValueOrDefault(nameOf<DocumentInfo>('primary_sme_name'), ''),
            primary_sme_phone: getTextValueOrDefault(nameOf<DocumentInfo>('primary_sme_phone'), ''),
            project: getTextValueOrDefault(nameOf<DocumentInfo>('project'), ''),
            publication_date: getTextValueOrDefault(nameOf<DocumentInfo>('publication_date'), ''),
            purpose: getTextValueOrDefault(nameOf<DocumentInfo>('purpose'), null).toString(),

            tm_title: getTextValueOrDefault(nameOf<DocumentInfo>('suggested_title'), ''),
            tm_authors: getTextValueOrDefault(nameOf<DocumentInfo>('suggested_author'), ''),
            tm_publication_date: getTextValueOrDefault(nameOf<DocumentInfo>('suggested_publication_date'), ''),

            tm_locations: getTextValueOrDefault(nameOf<DocumentInfo>('suggested_locations'), ''),
            tm_organizations: getTextValueOrDefault(nameOf<DocumentInfo>('suggested_organizations'), ''),
            tm_references: getTextValueOrDefault(nameOf<DocumentInfo>('suggested_references'), ''),
            tm_topics: getTextValueOrDefault(nameOf<DocumentInfo>('suggested_topics'), ''),


            secondary_sme_email: getTextValueOrDefault(nameOf<DocumentInfo>('secondary_sme_email'), ''),
            secondary_sme_name: getTextValueOrDefault(nameOf<DocumentInfo>('secondary_sme_name'), ''),
            secondary_sme_phone: getTextValueOrDefault(nameOf<DocumentInfo>('secondary_sme_phone'), ''),
            scope: getTextValueOrDefault(nameOf<DocumentInfo>('scope'), 'Public'),
            title: getTextValueOrDefault(nameOf<DocumentInfo>('title'), ''),
            upload_date: getTextValueOrDefault(nameOf<DocumentInfo>('upload_date'), ''),
            uploaded_by: getTextValueOrDefault(nameOf<DocumentInfo>('uploadedBy_id'), ''),
        }

        return serverDoc;
    }
}
