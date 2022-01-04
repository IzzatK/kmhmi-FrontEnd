import {IEntityProvider} from "../common/iEntityProvider";
import {RoleInfo} from "../../model";
import {UserInfo} from "../../model";

export interface IUserProvider extends IEntityProvider<UserInfo>{
    setRoleProvider(provider: IEntityProvider<RoleInfo>): void;
}
