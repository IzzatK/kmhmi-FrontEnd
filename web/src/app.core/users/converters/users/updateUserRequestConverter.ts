import {nameOf} from "../../../../framework.core/extras/utils/typeUtils";
import {UserInfo} from "../../../../app.model";
import {getDateWithoutTime} from "../../../../framework.core/extras/utils/timeUtils";
import {ReferenceType} from "../../../../app.model";
import {forEach} from "../../../../framework.core/extras/utils/collectionUtils";
import {ReferenceInfo} from "../../../../app.model";
import {Converter} from "../../../common/converters/converter";
import {AuthenticationStatus} from "../../../../app.core.api";

export class UpdateUserRequestConverter extends Converter<any, any> {

    convert(fromData: { id: string, latestUser: UserInfo, modifiedUser: Record<string, any> }): any {

        const { latestUser, modifiedUser={} } = fromData;

        const dictionary:Record<string, any> = latestUser;

        let numValues = ["dept_id", "department", "dod_id"];

        const getTextValueOrDefault = (propertyName: string, defaultValue: any) => {
            let result = defaultValue;
            if (modifiedUser[propertyName]) {
                result =  modifiedUser[propertyName];
            }
            else if (dictionary[propertyName])
            {
                result = dictionary[propertyName];
            }

            //convert id to number
            let convertToInt = false;

            numValues.map((item: string) => {
                if (item === propertyName) {
                    convertToInt = true;
                }
            });

            if (convertToInt) {
                return parseInt(result);
            } else {
                return result;
            }
        }

        let dodid = `${Math.floor(Math.random() * 1000000000)}`;

        let tmpRoles = [];
        if (modifiedUser['role']) {
            //check if role has been changed
            let role = parseInt(modifiedUser['role']);
            if (role) {
                tmpRoles.push(role);
            }
        } else if (latestUser['role']) {
            //fetch role
            let role = parseInt(latestUser['role']);
            if (role) {
                tmpRoles.push(role);
            }
        } else {
            //if no role set it to VIEWER
            let references = this.getRepoItems(ReferenceInfo.class);
            forEach(references, (referenceInfo: ReferenceInfo) => {
                if (referenceInfo.type === ReferenceType.ROLE && referenceInfo.title.toUpperCase() === 'VIEWER') {
                    let role = parseInt(referenceInfo.id);
                    tmpRoles.push(role)
                    return true;
                }
            });
        }

        let tmpAccountStatus: AuthenticationStatus = getTextValueOrDefault(nameOf<UserInfo>('account_status'), '');
        let serverAccountStatus = '';
        if (tmpAccountStatus) {
            switch (tmpAccountStatus) {
                case AuthenticationStatus.NONE:
                    break;
                case AuthenticationStatus.CREATED:
                    serverAccountStatus = 'Created';
                    break;
                case AuthenticationStatus.ACTIVE:
                    serverAccountStatus = 'Active';
                    break;
                case AuthenticationStatus.REJECTED:
                    serverAccountStatus = 'Rejected';
                    break;

            }
        }

        debugger;

        let serverUser = {
            // id: id,
            dod_id: getTextValueOrDefault(nameOf<UserInfo>('dod_id'), dodid),
            first_name: getTextValueOrDefault(nameOf<UserInfo>('first_name'), ''),
            middle_initial: '',
            last_name: getTextValueOrDefault(nameOf<UserInfo>('last_name'), ''),
            email_address: getTextValueOrDefault(nameOf<UserInfo>('email_address'), ''),
            phone_number: getTextValueOrDefault(nameOf<UserInfo>('phone_number'), ''),
            dept_id: getTextValueOrDefault(nameOf<UserInfo>('department'), 1006),
            preferred_results_view: getTextValueOrDefault(nameOf<UserInfo>('preferred_results_view'), 'Card'),
            account_status: serverAccountStatus,
            roles: tmpRoles,
            approved_by: getTextValueOrDefault(nameOf<UserInfo>('approved_by'), ''),
            date_approved: getDateWithoutTime(new Date()),
        }

        return serverUser;
    }
}
