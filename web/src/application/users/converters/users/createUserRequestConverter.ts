import {nameOf} from "../../../../framework/extras/typeUtils";
import {UserInfo} from "../../../../model";
import {getDateWithoutTime} from "../../../../framework.visual/extras/utils/timeUtils";
import {ReferenceType} from "../../../../model";
import {forEach} from "../../../../framework.visual/extras/utils/collectionUtils";
import {ReferenceInfo} from "../../../../model";
import {userService} from "../../../serviceComposition";
import {Converter} from "../../../common/converters/converter";

export class CreateUserRequestConverter extends Converter<any,any>{


    convert(fromData: { user: UserInfo}): any {

        const { user={}, } = fromData;

        const dictionary: Record<string, any> = user;

        const getTextValueOrDefault = (propertyName: string, defaultValue: any) => {
            let result = defaultValue;
            if (dictionary[propertyName]) {
                result =  dictionary[propertyName];
            }
            return result;
        }

        let roles = [];
        if (dictionary['roles'] && dictionary['roles'] !== null && dictionary['roles'] !== undefined && dictionary['roles'].length > 0) {
            roles.push(dictionary['roles']);
        }
        else {
            let references = this.getRepoItems<ReferenceInfo>(ReferenceInfo.class);
            forEach(references, (referenceInfo: ReferenceInfo) => {
                if (referenceInfo.type === ReferenceType.ROLE && referenceInfo.title.toUpperCase() == 'VIEWER') {
                    roles.push(referenceInfo.id)
                    return true;
                }
            });
        }

        // this will need to come from cac card (authentication service)
        let dodid = `${Math.floor(Math.random() * 1000000000)}`;


        let serverUser = {
            dod_id: getTextValueOrDefault(nameOf<UserInfo>('dod_id'), dodid),
            first_name: getTextValueOrDefault(nameOf<UserInfo>('first_name'), ''),
            middle_initial: '',
            last_name: getTextValueOrDefault(nameOf<UserInfo>('last_name'), ''),
            email_address: getTextValueOrDefault(nameOf<UserInfo>('email_address'), ''),
            phone_number: getTextValueOrDefault(nameOf<UserInfo>('phone_number'), ''),
            dept_id: getTextValueOrDefault(nameOf<UserInfo>('department'), ''),
            preferred_results_view: getTextValueOrDefault(nameOf<UserInfo>('preferred_results_view'), ''),
            account_status: getTextValueOrDefault(nameOf<UserInfo>('account_status'), ''),
            role: roles,
            date_approved: getDateWithoutTime(new Date()),
            approved_by: userService.getCurrentUserId(),
        }

        return serverUser;
    }
}
