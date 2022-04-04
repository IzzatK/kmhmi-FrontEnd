import {Converter} from "../../common/converters/converter";

export class GetReportArrayRequestConverter extends Converter<any, any> {
    convert(uiRequestData?: string): any {
        const user_id = uiRequestData;

        const result: Record<string, any> = {};

        result["kp_type"] = ['Report'];
        result["user_id"] = user_id;
        result ["search_request"] = 'NULL';

        return result;
    }
}
