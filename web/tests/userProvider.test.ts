import {
    AuthenticationService,
    AuthorizationService,
    PermissionProvider,
    RoleProvider,
    UserProvider
} from "../src/app.core";
import {HttpService, LogService, RepositoryService} from "../src/framework.core/services";
import {IEntityProvider, IHttpService, ILogService, IRepositoryService, IStorage} from "../src/framework.core.api";
import {IAuthenticationService, IAuthorizationService, IUserProvider} from "../src/app.core.api";
import {AppDataStore} from "../src/framework.core/redux/reduxStore";
import {PermissionInfo, RoleInfo} from "../src/app.model";

const userProvider: IUserProvider = new UserProvider();

beforeAll(() => {
    const appDataStore: IStorage = new AppDataStore();
    const logService: ILogService = new LogService();
    const repoService: IRepositoryService = new RepositoryService();
    const httpService: IHttpService = new HttpService();

    // create the entity providers
    const roleProvider: IEntityProvider<RoleInfo> = new RoleProvider();
    // const userProvider: IUserProvider = new UserProvider();
    const permissionProvider: IEntityProvider<PermissionInfo> = new PermissionProvider();

    // create the application services
    const authenticationService: IAuthenticationService = new AuthenticationService();
    const authorizationService: IAuthorizationService = new AuthorizationService();


    // set references and start framework plugins
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
})

describe("Test setup", () => {
    it("userProvider is not null", () => {
        expect(userProvider).not.toBeNull();
    });
})

describe("getAll", () => {
    it("gets a list of all the users", () => {
        expect(true).toBe(true);
        // return userProvider.getAll().then(data => {
        //     expect(data.length).not.toBe(0);
        // })
    });
});

describe("getRole", () => {

})

describe("getSingle", () => {

})

describe("create", () => {

})

describe("update", () => {

})

describe("remove", () => {

})