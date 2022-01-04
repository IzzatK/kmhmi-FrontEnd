import {Converter} from "../../common/converters/converter";

export interface UploadDocumentRequestData {
    pendingFilesRaw: Record<string, any>,
    file: { name:string }
}

export class UploadDocumentRequestConverter extends Converter<any, any>{
    convert(fromData: UploadDocumentRequestData): any {
        const {pendingFilesRaw, file} = fromData;

        const formData = new FormData();

        const { name } = file;
        let item = pendingFilesRaw[name]
        formData.append("filename", item, item.name);

        return formData;
    }
}
