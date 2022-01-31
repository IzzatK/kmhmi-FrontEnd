import {makeGuid} from "../../framework.visual/extras/utils/uniqueIdUtils";
import {forEach, forEachKVP} from "../../framework.visual/extras/utils/collectionUtils";
import {UserInfo} from "../../app.model";
import {IAuthorizationService, IUserService, IReferenceService, IEntityProvider} from "../../app.core.api";
import {nameOf, Nullable} from "../../framework/extras/typeUtils";
import {ISelectionService} from "../../framework.api";
import {Plugin} from "../../framework/extras/plugin";
import {UserRequestInfo} from "../../app.model/userRequestInfo";
import {createSelector, OutputSelector} from "@reduxjs/toolkit";
import {getDateWithoutTime} from "../../framework.visual/extras/utils/timeUtils";

export class UserService extends Plugin implements IUserService {
    public static readonly class: string = 'UserService';
    private selectionService: Nullable<ISelectionService> = null;
    private authorizationService: Nullable<IAuthorizationService> = null;
    private referenceService: Nullable<IReferenceService> = null;
    private userProvider: Nullable<IEntityProvider<UserInfo>> = null;

    getActiveUsersSelector: OutputSelector<any, Record<string, UserInfo>, (res1: Record<string, UserInfo>) => Record<string, UserInfo>>;
    getPendingUsersSelector: OutputSelector<any, Record<string, UserInfo>, (res1: Record<string, UserInfo>) => Record<string, UserInfo>>;

    constructor() {
        super();
        this.appendClassName(UserService.class);

        this.getActiveUsersSelector = createSelector<any, Record<string, UserInfo>, Record<string, UserInfo>>(
            [() => this.getAll<UserInfo>(UserInfo.class)],
            (users) => {

                let result:Record<string, UserInfo> = {};
                forEach(users, (user: UserInfo) => {
                    let accountStatus = user.account_status || '';
                    accountStatus = accountStatus.toUpperCase();
                    if (accountStatus === 'ACTIVE') {
                        result[user.id] = user;
                    }
                    // else if (accountStatus !== 'INACTIVE') {
                    //     this.warn(`User with the id ${user.id} is has an account status of '${user.account_status}'. User will not appear in active or inactive lists `)
                    // }
                })

                return result;
            }
        )

        this.getPendingUsersSelector = createSelector<any, Record<string, UserInfo>, Record<string, UserInfo>>(
            [() => this.getAll<UserInfo>(UserInfo.class)],
            (users) => {

                let result:Record<string, UserInfo> = {};
                forEach(users, (user: UserInfo) => {
                    let accountStatus = user.account_status || '';
                    if (accountStatus.toUpperCase() !== 'ACTIVE') {
                        result[user.id] = user;
                    }
                })

                return result;
            }
        )
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

    getActiveUsers(): Record<string, UserInfo> {
        return this.getActiveUsersSelector(this.getRepoState());
    }

    createUser(userData: Record<string, string>) {
        // since we are posting and don't have an id yet, use a placeholder
        let tmpId = makeGuid();
        const userInfo: any = new UserInfo(tmpId);
        forEachKVP(userData, (key: string, value: string) => {
            userInfo[key] = value;
        })

        userInfo[nameOf<UserInfo>('account_status')] = 'Active';

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

    getPendingUsers(): Record<string, UserInfo> {
        return this.getPendingUsersSelector(this.getRepoState());
    }

    acceptUserRequest(id: string, role: string) {

        let repoItem = this.getRepoItem<UserInfo>(UserInfo.class, id);

        if (repoItem != null) {
            repoItem.account_status = 'Active';
            repoItem.role = role;
            repoItem.approved_by = this.getCurrentUserId();
            repoItem.date_approved = getDateWithoutTime(new Date());

            this.updateUser(repoItem);
        }
    }

    declineUserRequest(id: string) {
        this.removeUser(id);
    }
}
