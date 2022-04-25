import {SearchParamInfo} from "../../../../app.model";
import {Converter} from "../../../common/converters/converter";
import {forEach} from "../../../../framework.core/extras/utils/collectionUtils";

type OptionsDataType = {
    getSearchParamValue: (searchParam: SearchParamInfo) => Record<string,any>
}

export class GetSearchResultsArrayRequestConverter extends Converter<any, any>{
    convert(fromData: any, reject: any, options: OptionsDataType): any {
        const result: Record<string, any> = {};

        const searchParams = fromData;

        const { uploaded_documents_only, user_id } = searchParams;

        if (!uploaded_documents_only) {
            forEach(searchParams, (searchParam: SearchParamInfo ) => {
                const { dirty = false } = searchParam;

                if (dirty || searchParam.id === 'search_request') {
                    let searchValue:Record<string,any> = options.getSearchParamValue(searchParam);

                    let keys = Object.keys(searchValue), length = keys.length;
                    for (let index = 0; index < length; index++) {
                        let key = keys[index];
                        let value = searchValue[key];

                        // only append to the search request if we got valid data
                        if (Array.isArray(value)) {
                            if (value.length > 0) {
                                result[key] = value;
                            }
                        }
                        else if (value) {
                            result[key] = value;
                        }
                        else if (key === 'search_request' && value === '') {
                            result[key] = 'NULL';
                        }
                    }
                }
            });
        } else {
            result["user_id"] = user_id;
            result["search_request"] = 'NULL';
            result["scope"] = 'Draft';
        }

        const { limit, offset, sort, ...rest } = result;

        return {
            ...rest
        };
    }
}
