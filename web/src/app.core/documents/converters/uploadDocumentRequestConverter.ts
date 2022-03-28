import {Converter} from "../../common/converters/converter";

export interface UploadDocumentRequestData {
    pendingFilesRaw: Record<string, any>,
    file: { name:string },
    user_id: string,
}

export class UploadDocumentRequestConverter extends Converter<any, any>{
    convert(fromData: UploadDocumentRequestData): any {
        const {pendingFilesRaw, file, user_id } = fromData;

        const formData = new FormData();

        const { name } = file;
        let item = pendingFilesRaw[name]
        formData.append("filename", item, item.name);

        if (user_id) {
            formData.append("user_id", user_id);
        }

        return formData;
    }
}
