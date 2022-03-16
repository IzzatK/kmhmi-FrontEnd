import {IEntityProvider} from "../../framework.core.api";
import {RoleInfo} from "../../app.model";
import {UserInfo} from "../../app.model";

export interface JIUserProvider extends IEntityProvider<UserInfo>{
    setRoleProvider(provider: IEntityProvider<RoleInfo>): void;
}
