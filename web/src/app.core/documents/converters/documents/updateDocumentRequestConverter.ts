import {Converter} from "../../../common/converters/converter";
import {DocumentInfo} from "../../../../app.model";
import {forEachKVP} from "../../../../framework.core/extras/utils/collectionUtils";

export class UpdateDocumentRequestConverter extends Converter<any, any> {

    convert(fromData: any): any {

        const { modifiedDocument } = fromData;

        const DocumentProperties: Partial<Record<keyof DocumentInfo, any>> = {
            id: "id",
            author: "author",
            private_tag: "custom_personal_tag",
            public_tag: "custom_shared_tag",
            department: "department",
            primary_sme_email: "primary_sme_email",
            primary_sme_name: "primary_sme_name",
            primary_sme_phone: "primary_sme_phone",
            project: "project",
            publication_date: "publication_date",
            purpose: "purpose",
            secondary_sme_email: "secondary_sme_email",
            secondary_sme_name: "secondary_sme_name",
            secondary_sme_phone: "secondary_sme_phone",
            scope: "scope",
            title: "title",
            upload_date: "upload_date",
            uploadedBy_id: "uploaded_by",
        }

        let serverDoc: Record<string, any> = {};

        let numValues: Record<string, string> = {
            "department": "department",
        };

        forEachKVP(modifiedDocument, (itemKey: keyof DocumentInfo, itemValue: any) => {
            let serverDocKey = DocumentProperties[itemKey];

            if (serverDocKey) {
                if (itemValue !== "") {
                    if (itemKey === "public_tag") {
                        let tagsArray: string[] = [];
                        forEachKVP(itemValue, (item: string) => {
                            if (item !== "") {
                                tagsArray.push(item);
                            }
                        })
                        serverDoc[serverDocKey] = tagsArray;
                    } else if (itemKey === "private_tag") {
                        let tagsArray: any[] = [];
                        forEachKVP(itemValue, (itemKey: string, itemValue: Record<string, string>) => {
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
                        serverDoc[serverDocKey] = tagsArray;
                    } else {
                        if (numValues[serverDocKey]) {
                            serverDoc[serverDocKey] = parseInt(itemValue);
                        } else {
                            serverDoc[serverDocKey] = itemValue;
                        }
                    }
                }
            }
        });

        return serverDoc;
    }
}
