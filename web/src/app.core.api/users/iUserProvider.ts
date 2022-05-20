import {IEntityProvider} from "../../framework.core.api";
import {RoleInfo} from "../../app.model";
import {UserInfo} from "../../app.model";
import {RoleProvider} from "../../app.core";

export interface IUserProvider extends IEntityProvider<UserInfo>{
    setRoleProvider(provider: RoleProvider): void;
}
