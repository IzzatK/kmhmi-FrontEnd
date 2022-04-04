import {Converter} from "../../common/converters/converter";
import {ReportInfo} from "../../../app.model";

export class ReportResponseConverter extends Converter<any, ReportInfo> {
    convert(fromData: any, reject?: any, options?: any): ReportInfo {

        return new ReportInfo("");
    }

}
