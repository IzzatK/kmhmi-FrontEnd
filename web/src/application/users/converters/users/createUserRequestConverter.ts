import {nameOf} from "../../../../framework/extras/typeUtils";
import {UserInfo} from "../../../../model";
import {Converter} from "../../../common/converters/converter";
import {getDateWithoutTime} from "../../../../framework.visual/extras/utils/timeUtils";

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

        let serverUser = {
            // id: id,
            dod_id: getTextValueOrDefault(nameOf<UserInfo>('dod_id'), '-1'),
            first_name: getTextValueOrDefault(nameOf<UserInfo>('first_name'), ''),
            middle_initial: '',
            last_name: getTextValueOrDefault(nameOf<UserInfo>('last_name'), ''),
            email_address: getTextValueOrDefault(nameOf<UserInfo>('email_address'), ''),
            phone_number: getTextValueOrDefault(nameOf<UserInfo>('phone_number'), ''),
            dept_id: 1010,
            preferred_results_view: 'Card'
            // account_status: getTextValueOrDefault(nameOf<UserInfo>('account_status'), ''),
            // roles: roles,
            // approved_by: getTextValueOrDefault(nameOf<UserInfo>('approved_by'), ''),
            // date_approved: getDateWithoutTime(new Date()),
        }

        return serverUser;
    }
}
