import {
    AuthenticationService,
    AuthorizationService,
    DocumentProvider,
    ExcerptRequestConverter,
    PermissionProvider,
    RoleProvider,
    UserProvider
} from "../src/app.core";
import {HttpService, LogService, RepositoryService} from "../src/framework.core/services";
import {
    IEntityProvider,
    IFetchAdapter,
    IHttpService,
    ILogService,
    IRepositoryService,
    IStorage
} from "../src/framework.core.api";
import {IAuthenticationService, IAuthorizationService, IUserProvider} from "../src/app.core.api";
import {AppDataStore} from "../src/framework.core/redux/reduxStore";
import {DocumentInfo, ParamType, PermissionInfo, ReferenceType, RoleInfo, SearchParamInfo} from "../src/app.model";
import {NodeFetchAdapter} from "../src/framework.core/networking/nodeFetchAdapter";
import {nameOf, Nullable} from "../src/framework.core/extras/utils/typeUtils";
import {forEachKVP} from "../src/framework.core/extras/utils/collectionUtils";
import {getDateWithoutTime} from "../src/framework.core/extras/utils/timeUtils";

const permissionProvider: IEntityProvider<PermissionInfo> = new PermissionProvider();
const repoService: IRepositoryService = new RepositoryService();

beforeAll(() => {
    const appDataStore: IStorage = new AppDataStore();
    const logService: ILogService = new LogService();
    const fetchAdapter: IFetchAdapter = new NodeFetchAdapter();
    const httpService: IHttpService = new HttpService();

    // create the entity providers
    const roleProvider: IEntityProvider<RoleInfo> = new RoleProvider();
    const userProvider: IUserProvider = new UserProvider();

    // create the application services
    const authenticationService: IAuthenticationService = new AuthenticationService();
    const authorizationService: IAuthorizationService = new AuthorizationService();

    // log service
    logService.configure();
    logService.start();
    // repo service
    repoService.setLogService(logService);
    repoService.setStorage(appDataStore);
    repoService.start();
    // http service
    httpService.setLogService(logService);
    httpService.setAuthenticationService(authenticationService);
    httpService.setFetchAdapter(fetchAdapter)
    httpService.start();

    // set references and start entity providers
    // roles
    roleProvider.setLogService(logService);
    roleProvider.setRepositoryService(repoService);
    roleProvider.setHttpService(httpService);
    roleProvider.start();
    // users
    userProvider.setLogService(logService);
    userProvider.setRepositoryService(repoService);
    userProvider.setHttpService(httpService);
    userProvider.setRoleProvider(roleProvider);
    userProvider.start();
    // permissions
    permissionProvider.setLogService(logService);
    permissionProvider.setRepositoryService(repoService);
    permissionProvider.setHttpService(httpService);
    permissionProvider.start();

    // set references and start application services
    // authentication service
    authenticationService.setLogService(logService);
    authenticationService.setRepositoryService(repoService);
    authenticationService.setUserProvider(userProvider);
    authenticationService.setAppDataStore(appDataStore);
    authenticationService.setAuthorizationService(authorizationService);
    authenticationService.start();
    // authorization service
    authorizationService.setLogService(logService);
    authorizationService.setRepositoryService(repoService);
    authorizationService.setPermissionProvider(permissionProvider);
    authorizationService.setUserProvider(userProvider);
    authorizationService.setAppDataStore(appDataStore);
    authorizationService.setAuthenticationService(authenticationService);
    authorizationService.start();
});

describe("Test Setup", () => {

    it("document provider is not null", () => {
        expect(permissionProvider).not.toBeNull();
    });

    it("repoService is not null", () => {
        expect(repoService).not.toBeNull();
    });
});

describe("getAll", () => {
    it("get user permissions", () => {
        return permissionProvider.getAll({userId: 'bb025c46-c259-4543-99e2-eab6b819fbee'}).then(permission => {
            expect(permission).not.toBeNull();
            expect(permission.length).toEqual(16);
        });
    });

    it("get's viewer permissions", () => {
        return permissionProvider.getAll({userId: '57876684-b519-4d5b-af09-4848fb8ecff5'}).then(permission => {
            expect(permission).not.toBeNull();
            expect(permission.length).toEqual(16);
        })
    })

    it("get's content manager permissions", () => {
        return permissionProvider.getAll({userId: '2d965441-3800-4743-901a-cae6d6901fa3'}).then(permission => {
            expect(permission).not.toBeNull();
            expect(permission.length).toEqual(7);
        })
    })
})