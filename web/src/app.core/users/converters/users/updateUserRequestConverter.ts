import {nameOf} from "../../../../framework/extras/typeUtils";
import {UserInfo} from "../../../../app";
import {getDateWithoutTime} from "../../../../framework.visual/extras/utils/timeUtils";
import {ReferenceType} from "../../../../app";
import {forEach} from "../../../../framework.visual/extras/utils/collectionUtils";
import {ReferenceInfo} from "../../../../app";
import {repoService} from "../../../serviceComposition";
import {Converter} from "../../../common/converters/converter";

export class UpdateUserRequestConverter extends Converter<any, any> {

    convert(fromData: { id: string, latestUser: UserInfo, modifiedUser: Record<string, any> }): any {

        const { latestUser, modifiedUser={} } = fromData;

        const dictionary:Record<string, any> = latestUser;

        const getTextValueOrDefault = (propertyName: string, defaultValue: any) => {
            let result = defaultValue;
            if (modifiedUser[propertyName]) {
                result =  modifiedUser[propertyName];
            }
            else if (dictionary[propertyName])
            {
                result = dictionary[propertyName];
            }
            return result;
        }

        let dodid = `${Math.floor(Math.random() * 1000000000)}`;

        let roles = [];
        if (modifiedUser['role']) {
            roles.push(modifiedUser['role']);
        }
        else {
            let references = repoService.getAll(ReferenceInfo.class);
            forEach(references, (referenceInfo: ReferenceInfo) => {
                if (referenceInfo.type === ReferenceType.ROLE && referenceInfo.title.toUpperCase() == 'VIEWER') {
                    roles.push(referenceInfo.id)
                    return true;
                }
            });
        }


        let serverUser = {
            // id: id,
            dod_id: getTextValueOrDefault(nameOf<UserInfo>('dod_id'), dodid),
            first_name: getTextValueOrDefault(nameOf<UserInfo>('first_name'), ''),
            middle_initial: '',
            last_name: getTextValueOrDefault(nameOf<UserInfo>('last_name'), ''),
            email_address: getTextValueOrDefault(nameOf<UserInfo>('email_address'), ''),
            phone_number: getTextValueOrDefault(nameOf<UserInfo>('phone_number'), ''),
            dept_id: getTextValueOrDefault(nameOf<UserInfo>('department'), ''),
            preferred_results_view: getTextValueOrDefault(nameOf<UserInfo>('preferred_results_view'), 'Card'),
            account_status: getTextValueOrDefault(nameOf<UserInfo>('account_status'), ''),
            roles: roles,
            approved_by: getTextValueOrDefault(nameOf<UserInfo>('approved_by'), ''),
            date_approved: getDateWithoutTime(new Date()),
        }

        return serverUser;
    }
}
