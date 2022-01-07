import {
    IAuthorizationService,
    IEntityProvider,
    PERMISSION_ENTITY,
    PERMISSION_LEVEL,
    PERMISSION_OPERATOR,
} from "../../api";
import {Nullable} from "../../framework/extras/typeUtils";
import {IStorage} from "../../framework/api";
import {Plugin} from "../../framework/extras/plugin";
import {createSelector, createSlice, OutputSelector, Selector, Slice} from "@reduxjs/toolkit";
import {PermissionInfo} from "../../model/permissionInfo";
import {selectionService} from "../serviceComposition";
import {forEach} from "../../framework.visual/extras/utils/collectionUtils";

type AuthorizationState = {
    // permissions: Nullable<PERMISSION_TYPE[]>
}

type AuthenticationSliceType = Slice<AuthorizationState,
    {
        // setPermissions: (state: AuthorizationState, action: PayloadAction<PERMISSION_TYPE[]>) => void;
    }>;

export class AuthorizationService extends Plugin implements IAuthorizationService {
    public static readonly class:string = 'AuthorizationService';
    private appDataStore: Nullable<IStorage> = null;

    private model: AuthenticationSliceType;

    private permissionProvider?: Nullable<IEntityProvider<PermissionInfo>> = null;

    // private readonly getPermissionInfoSelector: Selector<any, Record<string, PermissionInfo>>;
    // private readonly getAllPermissionsGroupedByEntitySelector: Selector<any, Record<string, Record<string, ReferenceInfo>>>;
    private getPermissionInfoSelector: OutputSelector<any, PermissionInfo, (res1: Record<string, PermissionInfo>, res2: string) => PermissionInfo>;
    private permissionInfoSelector: Selector<any, Record<string, PermissionInfo>>;
    private getAllPermissionsGroupedByEntitySelector: OutputSelector<any, Record<string, Record<string, PERMISSION_LEVEL>>, (res: Record<string, PermissionInfo>) => Record<string, Record<string, PERMISSION_LEVEL>>>;

    constructor() {
        super();
        this.appendClassName(AuthorizationService.class);

        this.model = createSlice({
            name: 'application/authorization',
            initialState: {
                // permissions: null
            } as AuthorizationState,
            reducers: {
                // setPermissions: (state, action) => {
                //     state.permissions = action.payload;
                // }
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

        this.getPermissionInfoSelector = createSelector(
            [() => super.getAll<PermissionInfo>(PermissionInfo.class), () => selectionService.getContext('current-user')],
            (permissionInfos, id) => {
                return permissionInfos[id];
            }
        )
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

    getAuthorizationState(): AuthorizationState {
        return this.appDataStore?.getState()[this.model.name];
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



    setPermissionProvider(provider: IEntityProvider<PermissionInfo>): void {
        this.permissionProvider = provider;
    }
}
