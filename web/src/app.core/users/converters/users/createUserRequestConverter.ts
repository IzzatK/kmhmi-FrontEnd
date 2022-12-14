import {nameOf} from "../../../../framework.core/extras/utils/typeUtils";
import {UserInfo} from "../../../../app.model";
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

        // let roles = [];
        // if (dictionary['role']) {
        //     roles.push(dictionary['role']);
        // }
        // else {
        //     let references = repoService.getAll(ReferenceInfo.class);
        //     forEach(references, (referenceInfo: ReferenceInfo) => {
        //         if (referenceInfo.type === ReferenceType.ROLE && referenceInfo.title.toUpperCase() == 'VIEWER') {
        //             roles.push(referenceInfo.id)
        //             return true;
        //         }
        //     });
        // }

        let serverUser = {
            dod_id: getTextValueOrDefault(nameOf<UserInfo>('dod_id'), '-1'),
            first_name: getTextValueOrDefault(nameOf<UserInfo>('first_name'), ''),
            // middle_initial: '',
            last_name: getTextValueOrDefault(nameOf<UserInfo>('last_name'), ''),
            email_address: getTextValueOrDefault(nameOf<UserInfo>('email_address'), ''),
            phone_number: getTextValueOrDefault(nameOf<UserInfo>('phone_number'), ''),
            registration_reason: getTextValueOrDefault(nameOf<UserInfo>('registration_reason'), ''),
            dept_id: parseInt(getTextValueOrDefault(nameOf<UserInfo>('department'), '')),
        }

        return serverUser;
    }
}
