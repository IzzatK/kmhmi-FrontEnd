import {UserInfo} from "../../../app.model";
import { GetUserArrayRequestConverter } from "../converters/users/getUserArrayRequestConverter";
import { GetUserArrayResponseConverter } from "../converters/users/getUserArrayResponseConverter";
import { GetUserResponseConverter } from "../converters/users/getUserResponseConverter";
import { CreateUserRequestConverter } from "../converters/users/createUserRequestConverter";
import { UserStatusResponseConverter } from "../converters/users/userStatusResponseConverter";
import { UpdateUserRequestConverter } from "../converters/users/updateUserRequestConverter";
import {forEach} from "../../../framework.core/extras/utils/collectionUtils";
import {Nullable, promiseFulfilled} from "../../../framework.core/extras/utils/typeUtils";
import {EntityProvider} from "../../common/providers/entityProvider";
import {IUserProvider} from "../../../app.core.api";
import {RoleInfo} from "../../../app.model";
import {IEntityProvider} from "../../../framework.core.api";

const serverUrl = process.env.REACT_APP_SERVER_URL;

export class UserProvider extends EntityProvider<UserInfo> implements IUserProvider{
    public static class: string = 'UserProvider';
    baseUrl: string = `${serverUrl}/users`;

    private createUserRequestConverter!: CreateUserRequestConverter;
    private userStatusResponseConverter!: UserStatusResponseConverter;

    private updateUserRequestConverter!: UpdateUserRequestConverter;

    private getUserResponseConverter!: GetUserResponseConverter;

    private getUserArrayResponseConverter!: GetUserArrayResponseConverter;
    private getUserArrayRequestConverter!: GetUserArrayRequestConverter;

    constructor() {
        super();
        super.appendClassName(UserProvider.class);
    }

    start() {
        super.start();

        this.createUserRequestConverter = this.addConverter(CreateUserRequestConverter);
        this.userStatusResponseConverter = this.addConverter(UserStatusResponseConverter);

        this.updateUserRequestConverter = this.addConverter(UpdateUserRequestConverter);

        this.getUserResponseConverter = this.addConverter(GetUserResponseConverter);

        this.getUserArrayResponseConverter = this.addConverter(GetUserArrayResponseConverter);
        this.getUserArrayResponseConverter.singleConverter = this.getUserResponseConverter;

        this.getUserArrayRequestConverter = this.addConverter(GetUserArrayRequestConverter);

    }

    private roleProvider: Nullable<IEntityProvider<RoleInfo>> = null;

    setRoleProvider(provider: IEntityProvider<RoleInfo>) {
        this.roleProvider = provider;
    }

    getAll(uiRequestData?: any): Promise<UserInfo[]> {
        return new Promise((resolve, reject) => {
            super.sendGetAll(
                () => this.getUserArrayRequestConverter.convert(uiRequestData),
                (responseData, reject) => this.getUserArrayResponseConverter.convert(responseData, reject))
                .then(users => {

                    let promises: Promise<Nullable<UserInfo>>[] = [];

                    forEach(users, (user: UserInfo) => {
                        const {id} = user;

                        let nextUser: UserInfo = Object.assign(new UserInfo(id), user);

                        let promise = this.getRole(id, nextUser);

                        promises.push(promise);
                    })

                    Promise.allSettled(promises)
                        .then((results => {
                            let users: UserInfo[] = [];
                            forEach(results, (result: PromiseSettledResult<UserInfo>) => {
                                if (promiseFulfilled(result)) {
                                    users.push(result.value);
                                }
                            })

                            resolve(users);
                        }))
                        .catch(error => {
                            reject(error);
                        })
                })
                .catch(error => {
                    reject(error);
                })
        });
    }

    private getRole(id: string, nextUser: UserInfo): Promise<Nullable<UserInfo>> {
        return new Promise((resolve, reject) => {
            this.roleProvider?.getSingle(id)
                .then(roleInfo => {
                    // merge the role info with the user
                    if (roleInfo) {
                        nextUser.role = roleInfo.id;
                    }
                    resolve(nextUser);
                })
                .catch((error: any) => {
                    resolve(nextUser);
                    console.log(error);
                })

        });
    }

    getSingle(id: string): Promise<Nullable<UserInfo>> {
        return new Promise((resolve, reject) => {
            super.sendGetSingle(id,
                (responseData, reject) => this.getUserResponseConverter.convert(responseData[0], reject))
                .then(user => {
                    if (user != null) {
                        resolve(user);
                    }
                    else {
                        reject(user);
                    }
                })
                .catch(error => {
                    reject(error);
                })
        });
    }


    create(uiRequestData: { user: UserInfo }, onUpdated?: (user: UserInfo) => void): Promise<Nullable<UserInfo>> {
        return new Promise((resolve, reject) => {
                super.sendPost(
                    () => this.createUserRequestConverter.convert(uiRequestData),
                    (responseData, errorHandler) => this.userStatusResponseConverter.convert(responseData, errorHandler))
                    .then(data => {
                        const {status, id} = data;

                        uiRequestData.user.id = id;

                        if (onUpdated) {
                            onUpdated(uiRequestData.user);
                        }

                        // it's a single fetch to get the new user
                        setTimeout(() => {
                            this.getSingle(id)
                                .then(user => {
                                    resolve(user);
                                })
                                .catch(error => {
                                    reject(error);
                                });
                        }, 3000)
                    })
                    .catch(error => {
                        reject(error);
                    })
            }
        )
    }

    update(id: string, uiRequestData: { id: string, modifiedUser: Record<string, any> }, onUpdated?: (user: UserInfo) => void): Promise<Nullable<UserInfo>> {
        return new Promise((resolve, reject) => {
            this.sendPut(id,
                () => this.updateUserRequestConverter.convert(uiRequestData),
                (responseData, errorHandler) => this.getUserResponseConverter.convert(responseData, errorHandler))
                .then(user => {
                    if (user) {
                        resolve(user);
                    } else {
                        reject(`Error Updating User with id ${id}`);
                    }
                })
                .catch(error => {
                    reject(error);
                });
            }
        )
    }

    remove(id: string, onUpdated?: (user: UserInfo) => void): Promise<UserInfo> {
        return new Promise((resolve, reject) => {
            this.getSingle(id)
                .then(user => {
                    if (user != null) {
                        user.isUpdating = true;

                        if (onUpdated) {
                            onUpdated(user);
                        }
                        super.sendDelete(id,
                            (responseData, errorHandler) => this.userStatusResponseConverter.convert(responseData, errorHandler))
                            .then(data => {
                                if (data.id === user.id) {
                                    resolve(user);
                                }
                                else {
                                    reject('Could not delete user');
                                }
                            })
                            .catch(error => {
                                reject(error);
                            })
                    }
                })
                .catch(error => {
                    reject(error);
                });
            }
        )
    }
}
