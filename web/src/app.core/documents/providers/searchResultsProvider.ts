import {EntityProvider} from "../../common/providers/entityProvider";
import {
    ParamType,
    ReferenceInfo,
    SearchParamInfo,
    SortPropertyInfo, TagInfo
} from "../../../app.model";
import {DocumentResponseConverter} from "../converters/documents/documentResponseConverter";
import {PocketResponseConverter} from "../../pockets/converters/pockets/pocketResponseConverter";
import {ReportResponseConverter} from "../../reports/converters/reportResponseConverter";
import {GetSearchResultsArrayRequestConverter} from "../converters/searchResults/getSearchResultsArrayRequestConverter";
import {
    GetSearchResultsArrayResponseConverter
} from "../converters/searchResults/getSearchResultsArrayResponseConverter";

const serverUrl = process.env.REACT_APP_SERVER_URL;

export class SearchResultsProvider extends EntityProvider<any> {
    baseUrl: string = `${serverUrl}/documents`;
    public static class: string = 'SearchResultsProvider';

    private documentResponseConverter!: DocumentResponseConverter;
    private pocketResponseConverter!: PocketResponseConverter;
    private reportResponseConverter!: ReportResponseConverter;

    private getSearchResultsArrayRequestConverter!: GetSearchResultsArrayRequestConverter;
    private getSearchResultsArrayResponseConverter!: GetSearchResultsArrayResponseConverter;

    constructor() {
        super();
        super.appendClassName(SearchResultsProvider.class);
    }

    start() {
        super.start();

        this.documentResponseConverter = this.addConverter(DocumentResponseConverter);
        this.pocketResponseConverter = this.addConverter(PocketResponseConverter);
        this.reportResponseConverter = this.addConverter(ReportResponseConverter);

        this.getSearchResultsArrayRequestConverter = this.addConverter(GetSearchResultsArrayRequestConverter);
        this.getSearchResultsArrayResponseConverter = this.addConverter(GetSearchResultsArrayResponseConverter);
        this.getSearchResultsArrayResponseConverter.documentSingleConverter = this.documentResponseConverter;
        this.getSearchResultsArrayResponseConverter.pocketSingleConverter = this.pocketResponseConverter;
        this.getSearchResultsArrayResponseConverter.reportSingleConverter = this.reportResponseConverter;
    }

    getAll(uiRequestData: any): Promise<any[]> {
        return new Promise((resolve, reject) => {
            let requestData: any = this.getSearchResultsArrayRequestConverter.convert(uiRequestData, reject, { getSearchParamValue: this.getSearchParamValue});

            this.httpService?.createPOST(`${this.baseUrl}/search`, requestData)
                .then((data: any) => {
                    resolve(this.getSearchResultsArrayResponseConverter.convert(data, reject, { getSearchParamValue: this.getSearchParamValue}));
                })
                .catch((error: any) => {
                    reject(error);
                })
        });
    }

    getSearchParamValue(searchParam: SearchParamInfo) {
        const {id, value, type} = searchParam;

        let result;

        switch (type) {
            case ParamType.OPTIONS: {
                if (id === 'sort') {
                    const sortTypes = super.getRepoItems<SortPropertyInfo>(SortPropertyInfo.class);
                    let sortType: any = sortTypes[value];
                    result = {
                        [id]: sortType ? sortType.value : null
                    }
                } else {
                    let repoIdArray: string[] = [];
                    value.forEach((id: string) => {
                        let repoItem = super.getRepoItem(ReferenceInfo.class, id);

                        if (repoItem != null) {
                            repoIdArray.push(repoItem.id);
                        }
                    })

                    result = {
                        [id]: repoIdArray
                    }
                }

                break;
            }
            case ParamType.DATE_RANGE: {

                const {start_date, end_date} = value || {};

                let start_date_prop = id.replace('_date', '_start_date');
                let end_date_prop = id.replace('_date', '_end_date');

                result = {
                    [start_date_prop]: start_date,
                    [end_date_prop]: end_date
                }

                break;
            }
            case ParamType.STRING: {
                if (id === 'tags') {
                    let title: string[] = [];
                    value.forEach((id: string) => {
                        let repoItem: any = super.getRepoItem(TagInfo.class, id);

                        if (repoItem != null) {
                            title.push(repoItem.title);
                        }
                    })

                    result = {
                        ['custom_shared_tag']: title
                    }
                } else {
                    result = {
                        [id]: value
                    }
                }
                break;
            }
            case ParamType.NUMBER:
            default: {
                result = {
                    [id]: value
                }
                break;
            }
        }

        return result;
    };
}


