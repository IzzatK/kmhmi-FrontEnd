import {RoleInfo} from "../../../model";
import {EntityProvider} from "../../common/providers/entityProvider";
import {Nullable} from "../../../framework/extras/typeUtils";
import { GetSingleRoleResponseConverter } from "../converters/roles/getSingleRoleResponseConverter";

const serverUrl = process.env.REACT_APP_SERVER_URL;

export class RoleProvider extends EntityProvider<RoleInfo> {

    baseUrl: string = `${serverUrl}/users/-role-function`;
    public static class: string = 'RoleProvider';
    private getSingleRoleResponseConverter!: GetSingleRoleResponseConverter;

    constructor() {
        super();
        super.appendClassName(RoleProvider.class);
    }


    start() {
        super.start();

        this.getSingleRoleResponseConverter = this.addConverter(GetSingleRoleResponseConverter);
    }

    getSingle(id: string) : Promise<Nullable<RoleInfo>> {
        return new Promise((resolve, reject) => {
            super.sendGetSingle(id,
                (responseData, reject) => this.getSingleRoleResponseConverter.convert(responseData, reject))
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                })
        });
    }


}
