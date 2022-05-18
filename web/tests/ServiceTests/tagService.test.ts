import {
    IEntityProvider,
    IFetchAdapter,
    IHttpService,
    ILogService,
    IRepositoryService,
    IStorage
} from "../../src/framework.core.api";
import {HttpService, LogService, RepositoryService} from "../../src/framework.core/services";
import {AppDataStore} from "../../src/framework.core/redux/reduxStore";
import {IAuthenticationService, IAuthorizationService, ITagService, IUserProvider} from "../../src/app.core.api";
import {
    AuthenticationService,
    AuthorizationService,
    PermissionProvider,
    TagProvider,
    TagService,
    UserProvider
} from "../../src/app.core";
import {NodeFetchAdapter} from "../../src/framework.core/networking/nodeFetchAdapter";
import {
    appDataStore,
    authenticationService,
    authorizationService,
    logService,
    repoService
} from "../../src/serviceComposition";

beforeAll(() => {
    const logService: ILogService = new LogService();
    const repoService: IRepositoryService = new RepositoryService();
    const appDataStore: IStorage = new AppDataStore();

    // provider
    const tagProvider: TagProvider = new TagProvider();
    const userProvider: IUserProvider = new UserProvider();
    const permissionProvider: PermissionProvider = new PermissionProvider();

    // service
    const tagService: ITagService = new TagService();
    const httpService: IHttpService = new HttpService();
    const fetchAdapter: IFetchAdapter = new NodeFetchAdapter();
    const authenticationService: IAuthenticationService = new AuthenticationService();
    const authorizationService: IAuthorizationService = new AuthorizationService();

    // log Service
    logService.configure();
    logService.start();

    // repo service
    repoService.setLogService(logService);
    repoService.setStorage(appDataStore);
    repoService.start();

    // tag service
    tagService.setLogService(logService);
    tagService.setRepositoryService(repoService);
    tagService.setTagProvider(tagProvider);
    tagService.start();

    // tag provider
    tagProvider.setLogService(logService);
    tagProvider.setRepositoryService(repoService);
    tagProvider.setHttpService(httpService);

    // http Service
    httpService.setLogService(logService);
    httpService.setAuthenticationService(authenticationService);
    httpService.setFetchAdapter(fetchAdapter);

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