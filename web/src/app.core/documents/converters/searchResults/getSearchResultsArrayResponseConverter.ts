import {DocumentInfo, PocketMapper, ReportInfo, SearchParamInfo} from "../../../../app.model";
import {Converter} from "../../../common/converters/converter";
import {IConverter} from "../../../../framework.core.api";
import {getValueOrDefault, Nullable} from "../../../../framework.core/extras/utils/typeUtils";
import {forEach} from "../../../../framework.core/extras/utils/collectionUtils";
import {KM_API_SERVER_URL} from "../../../../app.config/config";

type OptionsDataType = {
    getSearchParamValue: (searchParam: SearchParamInfo) => Record<string,any>
}

export class GetSearchResultsArrayResponseConverter extends Converter<any,any[]>{

    private _documentSingleConverter!: IConverter<any, Nullable<DocumentInfo>>;
    private _pocketSingleConverter!: IConverter<any, Nullable<PocketMapper>>;
    private _reportSingleConverter!: IConverter<any, Nullable<ReportInfo>>;

    convert(fromData: any, reject: any, options: OptionsDataType): any[] {

        const searchResults: any[] = [];

        if (!Array.isArray(fromData)) {
            if (fromData === 'User waiting for approval by KM Admin') {
                window.alert(fromData);
            }
            reject('Error while parsing array of searchResults. Expected Array. Receive the following: <' + fromData + '>');
            return searchResults;
        }
        else {
            forEach(fromData, (item: any) => {
                switch (getValueOrDefault(item, 'kp_type', '')) {
                    case "Pocket":
                        const pocketMapper: Nullable<PocketMapper> = this._pocketSingleConverter.convert(item, reject);

                        if (pocketMapper) {
                            pocketMapper.pocket.id = getValueOrDefault(item, 'pocket_id', '');

                            searchResults.push(pocketMapper);
                        }

                        break;
                    case "Report":
                        const reportInfo: Nullable<ReportInfo> = this._reportSingleConverter.convert(item, reject);

                        if (reportInfo) {
                            reportInfo.id = getValueOrDefault(item, 'id', '');
                            reportInfo.original_url = `${KM_API_SERVER_URL}/documents/${reportInfo.id}?format=ORIGINAL`;
                            reportInfo.preview_url = `${KM_API_SERVER_URL}/documents/${reportInfo.id}?format=PREVIEW`;

                            searchResults.push(reportInfo);
                        }

                        break;
                    case "Document":
                    default:
                        // build up tags
                        const documentInfo: Nullable<DocumentInfo> = this._documentSingleConverter.convert(item, reject);

                        if (documentInfo) {
                            // id is on a different field....
                            documentInfo.id = getValueOrDefault(item, 'id', '');
                            documentInfo.original_url = `${KM_API_SERVER_URL}/documents/${documentInfo.id}?format=ORIGINAL`;
                            documentInfo.preview_url = `${KM_API_SERVER_URL}/documents/${documentInfo.id}?format=PREVIEW`;

                            searchResults.push(documentInfo);
                        }
                        break;
                }
            });
        }

        return searchResults;
    }

    get documentSingleConverter(): IConverter<any, Nullable<DocumentInfo>> {
        return this._documentSingleConverter;
    }

    set documentSingleConverter(value: IConverter<any, Nullable<DocumentInfo>>) {
        this._documentSingleConverter = value;
    }

    get pocketSingleConverter(): IConverter<any, Nullable<PocketMapper>> {
        return this._pocketSingleConverter;
    }

    set pocketSingleConverter(value: IConverter<any, Nullable<PocketMapper>>) {
        this._pocketSingleConverter = value;
    }

    get reportSingleConverter(): IConverter<any, Nullable<ReportInfo>> {
        return this._reportSingleConverter;
    }

    set reportSingleConverter(value: IConverter<any, Nullable<ReportInfo>>) {
        this._reportSingleConverter = value;
    }
}
