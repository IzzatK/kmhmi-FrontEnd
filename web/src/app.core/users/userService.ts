import {makeGuid} from "../../framework.core/extras/utils/uniqueIdUtils";
import {forEach, forEachKVP} from "../../framework.core/extras/utils/collectionUtils";
import {SearchParamInfo, UserInfo} from "../../app.model";
import {
    IAuthenticationService,
    IAuthorizationService,
    IReferenceService,
    IUserService,
    AuthenticationStatus
} from "../../app.core.api";
import {nameOf, Nullable} from "../../framework.core/extras/utils/typeUtils";
import {IEntityProvider, ISelectionService} from "../../framework.core.api";
import {Plugin} from "../../framework.core/extras/plugin";
import {UserRequestInfo} from "../../app.model";
import {createSelector, OutputSelector} from "@reduxjs/toolkit";
import {getDateWithoutTime} from "../../framework.core/extras/utils/timeUtils";

export class UserService extends Plugin implements IUserService {
    public static readonly class: string = 'UserService';
    private selectionService: Nullable<ISelectionService> = null;
    private authorizationService: Nullable<IAuthorizationService> = null;
    private authenticationService: Nullable<IAuthenticationService> = null;
    private referenceService: Nullable<IReferenceService> = null;
    private userProvider: Nullable<IEntityProvider<UserInfo>> = null;

    getActiveUsersSelector: OutputSelector<any, Record<string, UserInfo>, (res1: Record<string, UserInfo>) => Record<string, UserInfo>>;
    getPendingUsersSelector: OutputSelector<any, Record<string, UserInfo>, (res1: Record<string, UserInfo>) => Record<string, UserInfo>>;
    getSearchUsersSelector: OutputSelector<any, Record<string, UserInfo>, (res: Record<string, UserInfo>) => Record<string, UserInfo>>;

    constructor() {
        super();
        this.appendClassName(UserService.class);

        this.getActiveUsersSelector = createSelector(
            [(s) => this.getAll<UserInfo>(UserInfo.class)],
            (users) => {

                let result:Record<string, UserInfo> = {};
                forEach(users, (user: UserInfo) => {

                    if (user.account_status === AuthenticationStatus.ACTIVE) {
                        result[user.id] = user;
                    }

                    // else if (accountStatus !== 'INACTIVE') {
                    //     this.warn(`User with the id ${user.id} is has an account status of '${user.account_status}'. User will not appear in active or inactive lists `)
                    // }
                })

                return result;
            }
        )

        this.getPendingUsersSelector = createSelector(
            [(s) => this.getAll<UserInfo>(UserInfo.class)],
            (users) => {

                let result:Record<string, UserInfo> = {};
                forEach(users, (user: UserInfo) => {
                    if (user.account_status !== AuthenticationStatus.ACTIVE) {
                        result[user.id] = user;
                    }
                })

                return result;
            }
        )

        this.getSearchUsersSelector = createSelector(
            [(s) => this.getActiveUsers()],
            (items) => {
                let result:Record<string, UserInfo> = {};

                forEach(items, (item:UserInfo) => {
                    const { id } = item;

                    result[id] = item;
                });

                return result;
            }
        );
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

    setAuthenticationService(authenticationService: IAuthenticationService): void {
        this.authenticationService = authenticationService;
    }

    setReferenceService(referenceService: IReferenceService) {
        this.referenceService = referenceService;
    }

    fetchUser(id: string): Promise<Nullable<UserInfo>> {
        return new Promise<Nullable<UserInfo>>(
            ((resolve, reject) => {
                this.userProvider?.getSingle(id)
                    .then(latestUser => {
                        let localUser: any = this.getUser(id) || {};

                        let nextUser = {
                            ...latestUser,
                            ...localUser,
                        }

                        this.addOrUpdateRepoItem(nextUser);

                        resolve(nextUser);
                    })
                    .catch(error => {
                        reject(null);
                    });
            })
        )
    }

    fetchUsers() {
        let searchText = "NULL";

        if (this.getSearchText() !== "") {
            searchText = this.getSearchText();
        }

        this.userProvider?.getAll(searchText)
            .then(users => {
                this.clearSearch();
                this.addOrUpdateAllRepoItems(users);
            })
            .catch(error => {
                console.log(error);
            });
    }

    getUser(id: string): Nullable<UserInfo> {
        return super.getRepoItem<UserInfo>(UserInfo.class, id);
    }

    getActiveUsers(): Record<string, UserInfo> {
        return this.getActiveUsersSelector(this.getRepoState());
    }

    createUser(userData: Record<string, any>) {
        // since we are posting and don't have an id yet, use a placeholder
        let tmpId = makeGuid();
        const userInfo: any = new UserInfo(tmpId);
        forEachKVP(userData, (key: string, value: string) => {
            userInfo[key] = value;
        })

        userInfo[nameOf<UserInfo>('account_status')] = AuthenticationStatus.ACTIVE

        this.addOrUpdateRepoItem(userInfo);

        this.userProvider?.create({user: userInfo},
            (updatedUserInfo => {
                // we have the real id now, so remove the temp one and add the real one
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

    updateUser(modifiedUser: any) {
        const { id } = modifiedUser;

        let mergedUserInfo = {
            ...modifiedUser,
            isUpdating: true
        }

        this.addOrUpdateRepoItem(mergedUserInfo);

        this.userProvider?.update(id, {id, modifiedUser},
            (updatedUser) => {
                this.addOrUpdateRepoItem(updatedUser);
             })
            .then(user => {
                if (user != null) {
                    this.addOrUpdateRepoItem(user);
                }
            })
    }

    removeUser(id: string) {
        this.userProvider?.remove(id,
            (updatedUser) => {
                this.addOrUpdateRepoItem(updatedUser);
            })
            .then(user => {
                if (user != null) {
                    this.removeRepoItem(user);
                }
            })
            .catch(error => {
                console.log(error);
            });
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

        if (this.authenticationService != null) {
            result = this.authenticationService.getUserId();
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

    getPendingUsers(): Record<string, UserInfo> {
        return this.getPendingUsersSelector(this.getRepoState());
    }

    acceptUserRequest(id: string, role: string) {

        let repoItem = this.getRepoItem<UserInfo>(UserInfo.class, id);

        if (repoItem != null) {
            repoItem.account_status = AuthenticationStatus.ACTIVE;
            repoItem.role = role;
            repoItem.approved_by = this.getCurrentUserId();
            repoItem.date_approved = getDateWithoutTime(new Date());

            this.updateUser(repoItem);
        }
    }

    declineUserRequest(id: string) {
        this.removeUser(id);
    }

    clearSearch(): void {
        this.setSearchText("");
        let currentUser = this.getCurrentUser();

        let users = Object.assign({}, this.getPendingUsers());

        this.removeAllByType(UserInfo.class);

        this.addOrUpdateRepoItem(<UserInfo>currentUser);
        this.addOrUpdateAllRepoItems(<UserInfo[]>Object.values(users));
    }

    getSearchText(): string {
        let result = '';

        let repoItem: any = super.getRepoItem(SearchParamInfo.class, 'user_search_request');
        if (repoItem != null) {
            result = repoItem.value;
        }

        return result;
    }

    setSearchText(value: string): void {
        let repoItem = super.getRepoItem(SearchParamInfo.class, 'user_search_request');

        if (repoItem != null) {
            let next = Object.assign(new SearchParamInfo('user_search_request'), repoItem);
            next.value = value;
            this.addOrUpdateRepoItem(next);
        }
    }

    getSearchUsers(): Record<string, UserInfo> {
        return this.getSearchUsersSelector(super.getRepoState());
    }
}
