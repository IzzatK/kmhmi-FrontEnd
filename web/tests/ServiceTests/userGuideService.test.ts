import {IFetchAdapter, IHttpService, ILogService, IRepositoryService, IStorage} from "../../src/framework.core.api";
import {
    AuthenticationService, AuthorizationService,
    PermissionProvider,
    RoleProvider,
    UserGuideProvider,
    UserGuideService,
    UserProvider
} from "../../src/app.core";
import {HttpService, LogService, RepositoryService} from "../../src/framework.core/services";
import {AppDataStore} from "../../src/framework.core/redux/reduxStore";
import {IAuthenticationService, IAuthorizationService, IUserProvider} from "../../src/app.core.api";
import {NodeFetchAdapter} from "../../src/framework.core/networking/nodeFetchAdapter";

beforeAll(() => {

    const appDataStore: IStorage = new AppDataStore();
    const fetchAdapter: IFetchAdapter = new NodeFetchAdapter();

    // Providers
    const userGuideProvider: UserGuideProvider = new UserGuideProvider();
    const userProvider: IUserProvider = new UserProvider();
    const roleProvider: RoleProvider = new RoleProvider();
    const permissionProvider: PermissionProvider = new PermissionProvider();

    // Services
    const authenticationService: IAuthenticationService = new AuthenticationService();
    const authorizationService: IAuthorizationService = new AuthorizationService();
    const userGuideService: UserGuideService = new UserGuideService();
    const httpService: IHttpService = new HttpService();
    const logService: ILogService = new LogService();
    const repoService: IRepositoryService = new RepositoryService();


    // user guide service
    userGuideService.setLogService(logService);
    userGuideService.setRepositoryService(repoService);
    userGuideService.setUserGuideProvider(userGuideProvider);
    userGuideService.start();

    // log service
    logService.configure();
    logService.start;

    // repo service
    repoService.setLogService(logService);
    repoService.setStorage(appDataStore);
    repoService.start;

    // user provider
    userProvider.setLogService(logService);
    userProvider.setRepositoryService(repoService);
    userProvider.setHttpService(httpService);
    userProvider.setRoleProvider(roleProvider);
    userProvider.start();

    // Role Provider
    userProvider.setLogService(logService);
    userProvider.setRepositoryService(repoService);
    userProvider.setHttpService(httpService);
    userProvider.setRoleProvider(roleProvider);
    userProvider.start();

    // http Service
    httpService.setLogService(logService);
    httpService.setAuthenticationService(authenticationService);
    httpService.setFetchAdapter(fetchAdapter);
    httpService.start();

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