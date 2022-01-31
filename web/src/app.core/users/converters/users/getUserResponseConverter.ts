import {getValueOrDefault, Nullable} from "../../../../framework/extras/typeUtils";
import {UserInfo} from "../../../../app.model";
import {parseServerReferenceValueOrDefault} from "../../../common/converters/parsingUtils";
import {Converter} from "../../../common/converters/converter";
import {RegistrationStatus} from "../../../../app.core.api";

export class GetUserResponseConverter extends Converter<any, Nullable<UserInfo>>{
    convert(fromData: any, reject?: any): Nullable<UserInfo> {
        if (fromData == null) return null;

        let item = fromData;
        if (Array.isArray(fromData)) {
            item = fromData[0];
        }

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
        userInfo.approved_by = getValueOrDefault(item, 'approved_by', '');
        userInfo.isUpdating = false;
        userInfo.date_approved = getValueOrDefault(item, 'date_approved', '');


        let accountStatus = getValueOrDefault(item, 'account_status', '');

        if (accountStatus) {
            let registrationStatus: RegistrationStatus = RegistrationStatus.NONE;
            let accountStatusUpper = accountStatus.toUpperCase();
            switch (accountStatusUpper) {
                case 'CREATED':
                    registrationStatus = RegistrationStatus.SUBMITTED;
                    break;
                case 'ACTIVE':
                    registrationStatus = RegistrationStatus.APPROVED;
                    break;
                case 'REJECTED':
                    registrationStatus = RegistrationStatus.REJECTED;
                    break;
            }
            userInfo.account_status = registrationStatus;
        }

        return userInfo;
    }
}
