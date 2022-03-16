import {getValueOrDefault, Nullable} from "../../../../framework.core/extras/utils/typeUtils";
import {ReferenceInfo, UserInfo} from "../../../../app.model";
import {Converter} from "../../../common/converters/converter";
import {AuthenticationStatus} from "../../../../app.core.api";
import {forEachKVP} from "../../../../framework.core/extras/utils/collectionUtils";

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
            department = this.parseServerReferenceValueOrDefault(item, 'department', '');
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
        userInfo.role = Array.isArray(item.role_id) ? item.role_id[0] : '';


        let accountStatus = getValueOrDefault(item, 'account_status', '');

        if (accountStatus) {
            let registrationStatus: AuthenticationStatus = AuthenticationStatus.NONE;
            let accountStatusUpper = accountStatus.toUpperCase();
            switch (accountStatusUpper) {
                case 'CREATED':
                    registrationStatus = AuthenticationStatus.CREATED;
                    break;
                case 'ACTIVE':
                    registrationStatus = AuthenticationStatus.ACTIVE;
                    break;
                case 'REJECTED':
                    registrationStatus = AuthenticationStatus.REJECTED;
                    break;
            }
            userInfo.account_status = registrationStatus;
        }

        return userInfo;
    }

    parseServerReferenceValueOrDefault(object: any, propertyName: string, defaultValue: any) {
        let result = defaultValue;

        const referenceInfos = this.getRepoItems<ReferenceInfo>(ReferenceInfo.class);

        let title = object[propertyName];
        if (title) {
            let titleUpper = title.toUpperCase();

            let referenceInfo: Nullable<ReferenceInfo> = null;

            forEachKVP(referenceInfos, (itemKey: string, itemValue: ReferenceInfo) => {
                if (itemValue.title.toUpperCase() === titleUpper) {
                    referenceInfo = itemValue;
                    result = referenceInfo.id;
                    return true;
                }
            })

            if (!referenceInfo) {
                console.log(`Reference type with title '${titleUpper}' not found in ${JSON.stringify(referenceInfos)}`)
            }

        }
        else {
            console.log(`No ${propertyName} has been assigned for object ${JSON.stringify(object)}`)
        }

        return result;
    }
}
