import {Converter} from "../../common/converters/converter";
import {forEach} from "../../../framework.core/extras/utils/collectionUtils";
import {PermissionInfo} from "../../../app.model";
import {
    PERMISSION_ENTITY,
    PERMISSION_LEVEL,
    PERMISSION_OPERATOR,
} from "../../../app.core.api";


export class GetPermissionArrayResponseConverter extends Converter<any, PermissionInfo[]>{
    convert(fromData: any, reject: any, options: {userId: string}): PermissionInfo[] {

        let body = fromData[0];

        if (body === undefined) return [];

        const { function_name:permissions } = body;

        let result: PermissionInfo[] = [];

        if (permissions != null) {

            // gonna need some kind of conversion here

            // create all permissions here

            let lookup: Record<string, Record<string, PERMISSION_LEVEL>> = {};

            forEach(permissions, (permission:string) => {
                let params = permission.split(':');

                let rawEntity = params[0];
                let rawOperator = params[1];
                let rawLevel = params[2];

                let permissionInfo = new PermissionInfo(`${rawEntity}-${rawOperator}`);
                permissionInfo.entity = this.getEntity(rawEntity);
                permissionInfo.operator = this.getOperator(rawOperator);
                permissionInfo.level = this.getLevel(rawLevel);

                let cacheEntity = lookup[permissionInfo.entity];

                if (cacheEntity == null) {
                    lookup[permissionInfo.entity] = {};
                }

                let cacheOperator = lookup[permissionInfo.entity][permissionInfo.operator];

                if (cacheOperator == null) {
                    lookup[permissionInfo.entity][permissionInfo.operator] = permissionInfo.level;
                    result.push(permissionInfo);
                }
                else {
                    let existingLevel = lookup[permissionInfo.entity][permissionInfo.operator];

                    if (permissionInfo.level > existingLevel) {
                        lookup[permissionInfo.entity][permissionInfo.operator] = permissionInfo.level;
                        result.push(permissionInfo);
                    }
                }
            })
        }

        return result;
    }

    getEntity(param:string) : PERMISSION_ENTITY {
        let result = PERMISSION_ENTITY.NONE;

        switch(param) {
            case 'document':
                result = PERMISSION_ENTITY.DOCUMENT;
                break;
            case 'tags':
                result = PERMISSION_ENTITY.TAG;
                break;
            case 'user':
                result = PERMISSION_ENTITY.USER;
                break;
            case 'stat':
                result = PERMISSION_ENTITY.STAT;
                break;
        }

        return result;
    }

    getOperator(param:string) : PERMISSION_OPERATOR {
        let result = PERMISSION_OPERATOR.NONE;

        switch(param) {
            case 'delete':
                result = PERMISSION_OPERATOR.DELETE;
                break;
            case 'download':
                result = PERMISSION_OPERATOR.DOWNLOAD;
                break;
            case 'get':
                result = PERMISSION_OPERATOR.GET;
                break;
            case 'modify':
                result = PERMISSION_OPERATOR.MODIFY;
                break;
            case 'post':
                result = PERMISSION_OPERATOR.POST;
                break;
        }

        return result;
    }

    getLevel(param:string) : PERMISSION_LEVEL {
        let result = PERMISSION_LEVEL.NONE;

        switch(param) {
            case 'self':
                result = PERMISSION_LEVEL.SELF;
                break;
            case 'group':
                result = PERMISSION_LEVEL.GROUP;
                break;
            case '*':
                result = PERMISSION_LEVEL.ANY;
                break;
        }

        return result;
    }
}
