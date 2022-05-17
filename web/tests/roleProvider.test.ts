import {
    IEntityProvider,
    IFetchAdapter,
    IHttpService,
    ILogService,
    IRepositoryService,
    IStorage
} from "../src/framework.core.api";
import {AppDataStore} from "../src/framework.core/redux/reduxStore";
import {HttpService, LogService, RepositoryService} from "../src/framework.core/services";
import {IAuthenticationService, IAuthorizationService, IUserProvider} from "../src/app.core.api";
import {
    AuthenticationService,
    AuthorizationService,
    PermissionProvider,
    RoleProvider, StatProvider,
    UserProvider
} from "../src/app.core";
import {NodeFetchAdapter} from "../src/framework.core/networking/nodeFetchAdapter";
import {RoleInfo, StatInfo} from "../src/app.model";

const statProvider: IEntityProvider<StatInfo> = new StatProvider();

beforeAll( () => {

    const appDataStore: IStorage = new AppDataStore();
    const logService: ILogService = new LogService();
    const repoService: IRepositoryService = new RepositoryService();
    const fetchAdapter: IFetchAdapter = new NodeFetchAdapter();
    const httpService: IHttpService = new HttpService();

    // Create Entity Providers
    const roleProvider: IEntityProvider<RoleInfo> = new RoleProvider();
    const userProvider: IUserProvider = new UserProvider();
    const permissionProvider: PermissionProvider = new PermissionProvider();


    //Create the Application Services
    const authenticationService: IAuthenticationService = new AuthenticationService();
    const authorizationService: IAuthorizationService = new AuthorizationService();



    //log Service
    logService.configure();
    logService.start();

    // Repo Service
    repoService.setLogService(logService);
    repoService.setStorage(appDataStore);
    repoService.start();

    // Http Service
    httpService.setLogService(logService);
    httpService.setAuthenticationService(authenticationService);
    httpService.setFetchAdapter(fetchAdapter);
    httpService.start();

    // Role Provider
    roleProvider.setLogService(logService);
    roleProvider.setRepositoryService(repoService);
    roleProvider.setHttpService(httpService);
    roleProvider.start();

    // User Provider
    userProvider.setLogService(logService);
    userProvider.setRepositoryService(repoService);
    userProvider.setHttpService(httpService);
    userProvider.setRoleProvider(roleProvider);
    userProvider.start();

    // Permission Provider
    permissionProvider.setLogService(logService);
    permissionProvider.setRepositoryService(repoService);
    permissionProvider.setHttpService(httpService);
    permissionProvider.start();

    // Authentication Service
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
})

describe("Test Setup", () => {
    it("roleProvider is not null", () => {
        expect(RoleProvider).not.toBeNull();
    });
})

describe("getAll", () => {
    it("grabs all stats of role", () => {
        return statProvider.getAll().then(roleInfos => {
            expect(roleInfos.length).not.toBe(0);
            roleInfos.forEach(roleInfo => {
                expect(roleInfo.id).not.toBe("");
                expect(roleInfo.type).not.toBe(-1);
                expect(roleInfo).not.toBe("");
                expect(roleInfo.count).not.toBe(0);
            });
        });
    });
});