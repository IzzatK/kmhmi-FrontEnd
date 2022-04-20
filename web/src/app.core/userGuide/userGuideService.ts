import {Plugin} from "../../framework.core/extras/plugin";
import {IUserGuideService} from "../../app.core.api";
import {Nullable} from "../../framework.core/extras/utils/typeUtils";
import {IEntityProvider} from "../../framework.core.api";
import {UserGuideInfo} from "../../app.model";

export class UserGuideService extends Plugin implements IUserGuideService {
    public static readonly class: string = 'UserGuideService';

    private userGuideProvider: Nullable<IEntityProvider<UserGuideInfo>> = null;

    constructor() {
        super();
        this.appendClassName(UserGuideService.class);
    }

    setUserGuideProvider(provider: IEntityProvider<UserGuideInfo>): void {
        this.userGuideProvider = provider;
    }

    start() {
        super.start();
    }

    stop() {
        super.stop();
    }

    configure() {
        super.configure();
    }

    fetchUserGuide() {
        this.userGuideProvider?.getSingle("userGuideInfoId")
            .then(document => {
                if (document != null) {
                    this.addOrUpdateRepoItem(document);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    getUserGuide(): Nullable<UserGuideInfo> {
        return super.getRepoItem<UserGuideInfo>(UserGuideInfo.class, "userGuideInfoId");
    }
}