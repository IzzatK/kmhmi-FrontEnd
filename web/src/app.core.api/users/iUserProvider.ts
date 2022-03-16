import {IEntityProvider} from "../../framework.core.api";
import {RoleInfo} from "../../app.model";
import {UserInfo} from "../../app.model";

export interface IUserProvider extends IEntityProvider<UserInfo>{
    setRoleProvider(provider: IEntityProvider<RoleInfo>): void;
}
