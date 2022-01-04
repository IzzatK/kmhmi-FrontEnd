import {getValueOrDefault, nameOf, Nullable} from "../../../../framework/extras/typeUtils";
import {UserInfo} from "../../../../model";
import {parseServerReferenceValueOrDefault} from "../../../common/converters/parsingUtils";
import {Converter} from "../../../common/converters/converter";

export class GetUserResponseConverter extends Converter<any, Nullable<UserInfo>>{
    convert(fromData: any, reject?: any): Nullable<UserInfo> {
        // console.log("converter " + JSON.stringify(fromData))
        const item = fromData;

        const userInfo: UserInfo = new UserInfo(getValueOrDefault(item, 'user_id', ''));


        let department = '';
        if (item['dept_id']) {
            department = getValueOrDefault(item, 'dept_id', '');
        }
        else if (item['department']) {
            department = parseServerReferenceValueOrDefault(item, 'department', '');
        }

        userInfo.dod_id = getValueOrDefault(item, 'dod_id', 0);
        userInfo.first_name = getValueOrDefault(item, 'first_name', '');
        userInfo.last_name = getValueOrDefault(item, 'last_name', '');
        userInfo.email_address = getValueOrDefault(item, 'email_address', '');
        userInfo.phone_number = getValueOrDefault(item, 'phone_number', '');
        userInfo.department = department;
        userInfo.preferred_results_view = getValueOrDefault(item, 'preferred_results_view', '');
        userInfo.account_status = getValueOrDefault(item, 'account_status', '');
        userInfo.approved_by = getValueOrDefault(item, 'approved_by', '');
        userInfo.isUpdating = false;
        userInfo.date_approved = getValueOrDefault(item, 'date_approved', '');

        return userInfo;
    }
}
