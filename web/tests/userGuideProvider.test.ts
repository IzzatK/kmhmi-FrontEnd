import {IAuthenticationService, IAuthorizationService, IUserProvider} from "../src/app.core.api";
import {
    AuthenticationService, AuthorizationService,
    PermissionProvider,
    UserGuideProvider,
    UserProvider
} from "../src/app.core";
import {
    IEntityProvider,
    IFetchAdapter,
    IHttpService,
    ILogService,
    IRepositoryService,
    IStorage
} from "../src/framework.core.api";
import {HttpService, LogService, RepositoryService} from "../src/framework.core/services";
import {AppDataStore} from "../src/framework.core/redux/reduxStore";
import {UserGuideInfo} from "../src/app.model";
import {NodeFetchAdapter} from "../src/framework.core/networking/nodeFetchAdapter";

const userGuideProvider: IEntityProvider<UserGuideInfo>= new UserGuideProvider();

beforeAll(() => {
    const repoService: IRepositoryService = new RepositoryService();
    const logService: ILogService = new LogService();
    const appDataStore: IStorage = new AppDataStore();
    const httpService: IHttpService = new HttpService();
    const fetchAdapter: IFetchAdapter = new NodeFetchAdapter();

    // Providers
    const userProvider: IUserProvider = new UserProvider();
    const permissionProvider: PermissionProvider = new PermissionProvider();


    //Authentication Params
    const authenticationService: IAuthenticationService = new AuthenticationService();
    const authorizationService: IAuthorizationService = new AuthorizationService();

    // userGuide Provider
    userGuideProvider.setLogService(logService);
    userGuideProvider.setRepositoryService(repoService);
    userGuideProvider.setHttpService(httpService);
    userGuideProvider.start();

    // Log Service
    logService.configure();
    logService.start();

    // Repo Service
    repoService.setLogService(logService);
    repoService.setStorage(appDataStore);
    repoService.start();

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

describe("Test Setup", () => {
    it("userGuideProvider is not Null", () => {
        expect(userGuideProvider).not.toBeNull();
    })
})