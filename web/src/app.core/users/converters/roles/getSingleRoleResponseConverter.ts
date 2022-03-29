import {ReferenceInfo, RoleInfo} from "../../../../app.model";
import {forEach, forEachKVP} from "../../../../framework.core/extras/utils/collectionUtils";
import {ReferenceType} from "../../../../app.model";
import {Nullable} from "../../../../framework.core/extras/utils/typeUtils";
import {Converter} from "../../../common/converters/converter";

export class GetSingleRoleResponseConverter extends Converter<any, Nullable<RoleInfo>>{
    convert(fromData: Array<any>, reject: any): Nullable<RoleInfo> {

        let body = fromData;

        if (body === undefined) return null;
        if (body[0] === undefined) return null;

        const { role_name:roleNames } = body[0];

        let rolesInfos = this.getRoles();

        let result: Nullable<RoleInfo> = null;

        if (roleNames) {
            forEach(roleNames, (roleName:string) => {

                let roleNameUpper: string = roleName.toUpperCase();

                forEachKVP(rolesInfos, (itemKey: string, itemValue: RoleInfo) => {
                    if (itemValue.title.toUpperCase() === roleNameUpper) {
                        result = itemValue;
                        return true;
                    }
                })

            })
        }


        return result;
    }

    getRoles(): Record<string, RoleInfo> {
        const references = this.getRepoItems(ReferenceInfo.class);
        const referenceType = ReferenceType.ROLE;
        let result: any = {};

        if (references) {
            forEach(references, (reference: { type: ReferenceType; id: string; }) => {
                if (reference.type === referenceType) {
                    result[reference.id] = reference;
                }
            });
        }

        return result;
    }
}
