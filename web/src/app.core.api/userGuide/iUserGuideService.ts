import {IEntityProvider, IPlugin} from "../../framework.core.api";
import {UserGuideInfo} from "../../app.model";
import {Nullable} from "../../framework.core/extras/utils/typeUtils";

export interface IUserGuideService extends IPlugin {

    fetchUserGuide(): void;

    getUserGuide(): Nullable<UserGuideInfo>;

    setUserGuideProvider(provider: IEntityProvider<UserGuideInfo>): void;
}