import {IEntityProvider} from "../common/iEntityProvider";
import {RoleInfo} from "../../app";
import {UserInfo} from "../../app";

export interface IUserProvider extends IEntityProvider<UserInfo>{
    setRoleProvider(provider: IEntityProvider<RoleInfo>): void;
}
