import {nameOf} from "../../../../framework/extras/typeUtils";
import {ReferenceInfo, ReferenceType, UserInfo} from "../../../../model";
import {Converter} from "../../../common/converters/converter";
import {getDateWithoutTime} from "../../../../framework.visual/extras/utils/timeUtils";
import {repoService} from "../../../serviceComposition";
import {forEach} from "../../../../framework.visual/extras/utils/collectionUtils";

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
        if (dictionary['role']) {
            roles.push(dictionary['role']);
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
            dod_id: getTextValueOrDefault(nameOf<UserInfo>('dod_id'), '-1'),
            first_name: getTextValueOrDefault(nameOf<UserInfo>('first_name'), ''),
            middle_initial: '',
            last_name: getTextValueOrDefault(nameOf<UserInfo>('last_name'), ''),
            email_address: getTextValueOrDefault(nameOf<UserInfo>('email_address'), ''),
            phone_number: getTextValueOrDefault(nameOf<UserInfo>('phone_number'), ''),
            dept_id: 1007,
            preferred_results_view: '',
            account_status: 'Active',
            roles: [1021],
            approved_by: '2826e532-6277-4950-b534-0531583b2c6e',
            date_approved: '2022-01-01'
        }

        return serverUser;
    }
}
