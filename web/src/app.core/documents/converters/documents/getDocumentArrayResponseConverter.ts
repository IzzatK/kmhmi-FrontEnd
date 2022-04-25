import {DocumentInfo, SearchParamInfo} from "../../../../app.model";
import {Converter} from "../../../common/converters/converter";
import {IConverter} from "../../../../framework.core.api";
import {getValueOrDefault, Nullable} from "../../../../framework.core/extras/utils/typeUtils";
import {forEach, sortByProperty} from "../../../../framework.core/extras/utils/collectionUtils";
import {KM_API_SERVER_URL} from "../../../../app.config/config";

type OptionsDataType = {
    getSearchParamValue: (searchParam: SearchParamInfo) => Record<string,any>
}

export class GetDocumentArrayResponseConverter extends Converter<any,DocumentInfo[]>{

    private _singleConverter!: IConverter<any, Nullable<DocumentInfo>>;

    convert(fromData: any, reject: any, options: OptionsDataType): DocumentInfo[] {

        const documents: DocumentInfo[] = [];

        if (!Array.isArray(fromData)) {
            if (fromData === 'User waiting for approval by KM Admin') {
                window.alert(fromData);
            }
            reject('Error while parsing array of documents. Expected Array. Receive the following: <' + fromData + '>');
            return documents;
        }
        else {
            // client side sorting. boooo
            const searchParams: any = super.getRepoItems<SearchParamInfo>(SearchParamInfo.class);

            const {sort:sortProperty} = searchParams;
            let searchValueObject: Record<string, any> = options.getSearchParamValue(sortProperty);

            //get sort value or set default sort value
            let sortValue: string = searchValueObject['sort'] ? searchValueObject['sort'] : "author_ascending";
            fromData = sortByProperty(fromData, sortValue);

            forEach(fromData, (item: any) => {
                // build up tags
                const documentInfo: Nullable<DocumentInfo> = this._singleConverter.convert(item, reject);

                if (documentInfo != null) {
                    // id is on a different field....
                    documentInfo.id = getValueOrDefault(item, 'id', '');
                    documentInfo.original_url = `${KM_API_SERVER_URL}/documents/${documentInfo.id}?format=ORIGINAL`;
                    documentInfo.preview_url = `${KM_API_SERVER_URL}/documents/${documentInfo.id}?format=PREVIEW`;

                    documents.push(documentInfo);
                }
            });
        }

        return documents;
    }

    get singleConverter(): IConverter<any, Nullable<DocumentInfo>> {
        return this._singleConverter;
    }

    set singleConverter(value: IConverter<any, Nullable<DocumentInfo>>) {
        this._singleConverter = value;
    }
}
