import {makeGuid} from "../../framework.visual/extras/utils/uniqueIdUtils";
import {forEachKVP} from "../../framework.visual/extras/utils/collectionUtils";
import {ReferenceType} from "../../model";
import {UserInfo} from "../../model";
import {IAuthorizationService, IUserService} from "../../api";
import {Nullable} from "../../framework/extras/typeUtils";
import {ISelectionService} from "../../framework/api";
import {IReferenceService} from "../../api";
import {Plugin} from "../../framework/extras/plugin";
import {IEntityProvider} from "../../api";
import {UserRequestInfo} from "../../model/userRequestInfo";

export class UserService extends Plugin implements IUserService {
    public static readonly class: string = 'UserService';
    private selectionService: Nullable<ISelectionService> = null;
    private authorizationService: Nullable<IAuthorizationService> = null;
    private referenceService: Nullable<IReferenceService> = null;
    private userProvider: Nullable<IEntityProvider<UserInfo>> = null

    constructor() {
        super();
        this.appendClassName(UserService.class);
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

    setSelectionService(selectionService: ISelectionService) {
        this.selectionService = selectionService;
    }

    setAuthorizationService(authorizationService: IAuthorizationService): void {
        this.authorizationService = authorizationService;
    }

    setReferenceService(referenceService: IReferenceService) {
        this.referenceService = referenceService;
    }

    fetchUser(id: string) {
        this.userProvider?.getSingle(id)
            .then(latestUser => {
                let localUser: any = this.getUser(id) || {};

                let nextUser = {
                    ...latestUser,
                    ...localUser,
                }

                this.addOrUpdateRepoItem(nextUser);
            })
            .catch(error => {
                console.log(error);
            });
    }

    fetchUsers() {
        this.userProvider?.getAll('NULL')
            .then(users => {
                this.addOrUpdateAllRepoItems(users);
            })
            .catch(error => {
                console.log(error);
            });
    }

    getUser(id: string): Nullable<UserInfo> {
        return super.getRepoItem<UserInfo>(UserInfo.class, id);
    }

    getUsers(): Record<string, UserInfo> {
        let result: Record<string, UserInfo> = {};

        result = this.getAll<UserInfo>(UserInfo.class);

        return result;
    }

    createUser(userData: Record<string, string>) {
        // since we are posting and don't have an id yet, use a placeholder
        let tmpId = makeGuid();
        const userInfo: any = new UserInfo(tmpId);
        forEachKVP(userData, (key: string, value: string) => {
            userInfo[key] = value;
        })

        this.addOrUpdateRepoItem(userInfo);

        this.userProvider?.create({user: userInfo},
            (updatedUserInfo => {
                this.removeRepoItem(userInfo);
                this.addOrUpdateRepoItem(updatedUserInfo);
            }))
            .then(latestUser => {
                if (latestUser != null) {
                    this.addOrUpdateRepoItem(latestUser);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    updateUser(modifiedUser: UserInfo) {
        const { id } = modifiedUser;

        this.userProvider?.update(id, {id, modifiedUser})
            .then(user => {
                if (user != null) {
                    this.addOrUpdateRepoItem(user);
                }
            })
    }

    removeUser(id: string) {
        this.userProvider?.remove(id)
            .then(user => {
                if (user != null) {
                    this.removeRepoItem(user);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    setCurrentUser(id: string) {
        this.fetchUser(id);

        this.authorizationService?.fetchPermissions(id);

        this.selectionService?.setContext('current-user', id);
    }

    getCurrentUser(): Nullable<UserInfo> {
        let result = null;

        const id = this.getCurrentUserId();

        if (id != null) {
            result = super.getRepoItem<UserInfo>(UserInfo.class, id);
        }

        return result;
    }

    getCurrentUserId() {
        let result = '';

        if (this.selectionService != null) {
            result = this.selectionService.getContext('current-user');
        }

        return result;
    }

    setUserProvider(provider: IEntityProvider<UserInfo>): void {
        this.userProvider = provider;
    }

    getUserRequests(): Record<string, UserRequestInfo> {
        let result: Record<string, UserRequestInfo> = {};

        result = this.getAll<UserRequestInfo>(UserRequestInfo.class);

        return result;
    }

    acceptUserRequest(id: string) {
        //TODO
    }

    declineUserRequest(id: string) {
        //TODO
    }
}
