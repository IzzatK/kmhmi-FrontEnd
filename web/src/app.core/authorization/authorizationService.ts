import {
    AuthenticationStatus,
    IAuthenticationService,
    IAuthorizationService,
    PERMISSION_ENTITY,
    PERMISSION_LEVEL,
    PERMISSION_OPERATOR,
} from "../../app.core.api";
import {Nullable} from "../../framework.core/extras/utils/typeUtils";
import {IEntityProvider, IStorage} from "../../framework.core.api";
import {Plugin} from "../../framework.core/extras/plugin";
import {createSelector, createSlice, OutputSelector, PayloadAction, Selector, Slice} from "@reduxjs/toolkit";
import {PermissionInfo} from "../../app.model";
import {forEach} from "../../framework.core/extras/utils/collectionUtils";
import {isDev} from "../../framework.core/extras/utils/environmentUtils";
import {UserInfo} from "../../app.model";

type AuthorizationState = {
    // permissions: Nullable<PERMISSION_TYPE[]>
    hasError: boolean,
    isAuthorized: boolean,
    isAuthorizing: boolean,
    dodWarningAccepted: boolean
}

type AuthorizationSliceType = Slice<AuthorizationState,
    {
        setHasError: (state: AuthorizationState, action: PayloadAction<boolean>) => void;
        setIsAuthorized: (state:AuthorizationState, action:PayloadAction<boolean>) => void;
        setIsAuthorizing: (state:AuthorizationState, action:PayloadAction<boolean>) => void;
        setDodWarningAccepted: (state:AuthorizationState, action:PayloadAction<boolean>) => void;
    }>;

export class AuthorizationService extends Plugin implements IAuthorizationService {
    public static readonly class:string = 'AuthorizationService';
    private appDataStore: Nullable<IStorage> = null;
    private authenticationService: Nullable<IAuthenticationService> = null;

    // private model: AuthenticationSliceType;

    private permissionProvider?: Nullable<IEntityProvider<PermissionInfo>> = null;
    private userProvider?: Nullable<IEntityProvider<UserInfo>> = null;

    private readonly permissionInfoSelector: Selector<any, Record<string, PermissionInfo>>;
    private readonly getAllPermissionsGroupedByEntitySelector: OutputSelector<any, Record<string, Record<string, PERMISSION_LEVEL>>, (res: Record<string, PermissionInfo>) => Record<string, Record<string, PERMISSION_LEVEL>>>;
    private model: AuthorizationSliceType;

    constructor() {
        super();
        this.appendClassName(AuthorizationService.class);

        this.model = createSlice({
            name: 'app.core/authorization',
            initialState: {
                hasError: false,
                isAuthorizing: true,
                isAuthorized: false,
                dodWarningAccepted: false
            } as AuthorizationState,
            reducers: {
                setHasError: (state, action) => {
                    state.hasError = action.payload;
                },
                setIsAuthorized: (state, action) => {
                    state.isAuthorized = action.payload;
                },
                setIsAuthorizing: (state, action) => {
                    state.isAuthorizing = action.payload;
                },
                setDodWarningAccepted: (state, action) => {
                    state.dodWarningAccepted = action.payload;
                }
            },
        });

        this.permissionInfoSelector = createSelector(
            [() => this.getAll<PermissionInfo>(PermissionInfo.class)],
            (permissions) => {
                return permissions;
            }
        )

        this.getAllPermissionsGroupedByEntitySelector = createSelector(
            [this.permissionInfoSelector],
            (permissions) => {
                let result: Record<string, Record<string, PERMISSION_LEVEL>> = {};

                if (permissions != null) {
                    forEach(permissions, (permission: PermissionInfo) => {
                        if (permission.entity != null) {
                            if (result[permission.entity] == null) {
                                result[permission.entity] = {};
                            }

                            if (permission.operator != null) {
                                result[permission.entity][permission.operator] = permission.level || PERMISSION_LEVEL.NONE;
                            }
                        }

                    });
                }
                return result;
            }
        );
    }

    setAuthenticationService(service: IAuthenticationService): void {
        this.authenticationService = service;
    }

    getState(): AuthorizationState {
        return this.appDataStore?.getState()[this.model.name];
    }

    start() {
        super.start();

        this.appDataStore?.addEventHandlers(this.model.name, this.model.reducer);
    }

    stop() {
        super.stop();
    }

    configure() {
        super.configure();
    }

    setAppDataStore(appDataStore: IStorage) {
        this.appDataStore = appDataStore;
    }

    authorizeUser(userId: string) {
        this.appDataStore?.sendEvent(this.model.actions.setIsAuthorizing(true));

        const me = this;
        const fetchUser = () => {
            me.userProvider?.getSingle(userId)
                .then(userInfo => {
                    if (userInfo != null) {
                        me.addOrUpdateRepoItem(userInfo);
                        me.authenticationService?.setRegistrationStatus(userInfo.account_status);

                        if (userInfo.account_status !== AuthenticationStatus.ACTIVE) {
                            setTimeout(() => {
                                fetchUser();
                            }, 5000);
                        } else {
                            // once the user is approved, then fetch the permissions
                            me.appDataStore?.sendEvent(this.model.actions.setIsAuthorized(true));
                            me.fetchPermissions(userId);
                        }
                    }
                })
                .catch(error => {
                    me.authenticationService?.setRegistrationStatus(AuthenticationStatus.REJECTED);
                    me.appDataStore?.sendEvent(this.model.actions.setHasError(true));
                })
                .finally(() => {
                    me.appDataStore?.sendEvent(this.model.actions.setIsAuthorizing(false));
                })
        }
        fetchUser();
    }

    fetchPermissions(userId: string): void {
        this.removeAllByType(PermissionInfo.class);

        this.permissionProvider?.getAll({userId})
            .then(permissionInfos => {
                if (permissionInfos != null) {
                    this.addOrUpdateAllRepoItems(permissionInfos);
                }
            })
            .catch(error => {
                this.removeAllById(PermissionInfo.class, userId);
            })
    }

    getPermissionLevel(entity: PERMISSION_ENTITY, operator: PERMISSION_OPERATOR): PERMISSION_LEVEL {
        let result = PERMISSION_LEVEL.NONE;

        let permissions = this.getAllPermissionsGroupedByEntitySelector(this.getRepoState());

        let permissionEntity = permissions[entity];
        if (permissionEntity != null) {
            let permissionLevel = permissionEntity[operator];
            if (permissionLevel != null) {
                result = permissionLevel;
            }
        }

        return result;
    }

    getPermissions(): Record<string, PermissionInfo> {
        return this.permissionInfoSelector(this.getRepoState());
    }

    hasPermission(entity: PERMISSION_ENTITY, operator: PERMISSION_OPERATOR, currentUserId?: string, entityOwnerId?: Nullable<string>): boolean {
        let result = false;

        let permissionLevel = this.getPermissionLevel(entity, operator);

        if (permissionLevel === PERMISSION_LEVEL.ANY) {
            result = true;
        }
        else if (permissionLevel === PERMISSION_LEVEL.SELF) {
            if (currentUserId && entityOwnerId) {
                result = entityOwnerId === currentUserId;
            }
        }

        return isDev() ? true : result;
    }

    setPermissionProvider(provider: IEntityProvider<PermissionInfo>): void {
        this.permissionProvider = provider;
    }

    setUserProvider(provider: IEntityProvider<UserInfo>): void {
        this.userProvider = provider;
    }

    isAuthorizing(): boolean {
        return this.getState().isAuthorizing;
    }

    isAuthorized(): boolean {
        return isDev() ? true :  this.getState().isAuthorized;
    }

    isDodWarningAccepted(): boolean {
        return isDev() ? true : this.getState().dodWarningAccepted;
    }

    setDodWarningAccepted(value: boolean): void {
        this.appDataStore?.sendEvent(this.model.actions.setDodWarningAccepted(value));
    }


}
