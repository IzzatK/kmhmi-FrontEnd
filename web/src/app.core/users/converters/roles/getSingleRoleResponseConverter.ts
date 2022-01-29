import {RoleInfo} from "../../../../app.model";
import {forEach, forEachKVP} from "../../../../framework.visual/extras/utils/collectionUtils";
import {ReferenceType} from "../../../../app.model";
import {Nullable} from "../../../../framework/extras/typeUtils";
import {referenceService} from "../../../serviceComposition";
import {Converter} from "../../../common/converters/converter";

export class GetSingleRoleResponseConverter extends Converter<any, Nullable<RoleInfo>>{
    convert(fromData: Array<any>, reject: any): Nullable<RoleInfo> {

        let body = fromData[0];

        if (body === undefined) return null;

        const { role_name:roleNames } = body;

        let rolesInfos = referenceService.getAllReferences(ReferenceType.ROLE);

        let result: Nullable<RoleInfo> = null;

        if (roleNames) {
            forEach(roleNames, (roleName:string) => {

                let roleNameUpper: string = roleName.toUpperCase();

                forEachKVP(rolesInfos, (itemKey: string, itemValue: RoleInfo) => {
                    if (itemValue.title.toUpperCase() == roleNameUpper) {
                        result = itemValue;
                        return true;
                    }
                })

            })
        }


        return result;
    }
}
