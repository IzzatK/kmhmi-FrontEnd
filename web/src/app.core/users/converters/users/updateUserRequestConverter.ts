import {UserInfo} from "../../../../app.model";
import {forEachKVP} from "../../../../framework.core/extras/utils/collectionUtils";
import {Converter} from "../../../common/converters/converter";
import {AuthenticationStatus} from "../../../../app.core.api";

export class UpdateUserRequestConverter extends Converter<any, any> {

    convert(fromData: any): any {

        const { modifiedUser } = fromData;

        const UserProperties: Partial<Record<keyof UserInfo, any>> = {
            id: "id",
            dod_id: "dod_id",
            first_name: "first_name",
            last_name: "last_name",
            email_address: "email_address",
            phone_number: "phone_number",
            department: "dept_id",
            preferred_results_view: "preferred_results_view",
            account_status: "account_status",
            role: "roles",
            approved_by: "approved_by",
            date_approved: "date_approved"
        }

        let serverUser: Record<string, any> = {};

        let numValues: Record<string, string> = {
            "department": "department",
            "dod_id": "dod_id",
        };

        forEachKVP(modifiedUser, (itemKey: keyof UserInfo, itemValue: any) => {
            let serverUserKey = UserProperties[itemKey];

            if (serverUserKey) {
                if (itemValue !== "") {
                    if (itemKey === "role") {
                        let rolesArray = [];
                        rolesArray.push(parseInt(itemValue));
                        serverUser[serverUserKey] = rolesArray;
                    } else if (itemKey === "account_status") {
                        let serverAccountStatus = '';
                        switch (itemValue) {
                            case AuthenticationStatus.ACTIVE:
                                serverAccountStatus = 'Active';
                                break;
                            case AuthenticationStatus.REJECTED:
                                serverAccountStatus = 'Rejected';
                                break;
                            case AuthenticationStatus.CREATED:
                            case AuthenticationStatus.NONE:
                            default:
                                serverAccountStatus = 'Created';
                                break;
                        }
                        serverUser[serverUserKey] = serverAccountStatus;
                    } else {
                        if (numValues[serverUserKey]) {
                            serverUser[serverUserKey] = parseInt(itemValue);
                        } else {
                            serverUser[serverUserKey] = itemValue;
                        }
                    }
                }
            }
        })

        return serverUser;
    }
}
