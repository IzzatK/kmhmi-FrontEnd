import {
    IEntityProvider,
    IHttpService,
    ILogService,
    IRepositoryService,
    ISelectionService
} from "../../src/framework.core.api";
import {HttpService, LogService, RepositoryService, SelectionService} from "../../src/framework.core/services";
import {IAuthenticationService, IAuthorizationService, IReferenceService, IUserProvider} from "../../src/app.core.api";
import {
    AuthenticationService,
    AuthorizationService,
    PermissionProvider,
    ReferenceService,
    UserProvider,
} from "../../src/app.core";
import {appDataStore, userService} from "../../src/serviceComposition";
import {PermissionInfo} from "../../src/app.model";

beforeAll(() => {
    const logService: ILogService = new LogService();
    const repoService: IRepositoryService = new RepositoryService();
    const selectionService: ISelectionService = new SelectionService();
    const refService: IReferenceService = new ReferenceService();
    const httpService: IHttpService = new HttpService();

    //Import Providers
    const userProvider: IUserProvider = new UserProvider();
    const permissionProvider: IEntityProvider<PermissionInfo> = new PermissionProvider();

    // Create Application Services
    const authorizationService: IAuthorizationService = new AuthorizationService();
    const authenticationService: IAuthenticationService = new AuthenticationService();

    //set references to framework plugins

    //log service
    logService.configure();
    logService.start();

    //repository service
    repoService.setLogService(logService);
    repoService.setStorage(appDataStore);
    repoService.start();

    // selection service
    selectionService.setLogService(logService);
    selectionService.setAppDataStore(appDataStore);
    selectionService.start();

    //reference service
    refService.setLogService(logService);
    refService.setRepositoryService(repoService);
    refService.start();

    // User Provider
    userProvider.setLogService(logService);
    userProvider.setRepositoryService(repoService);
    userProvider.setHttpService(httpService);
    userProvider.start();

    // Authorization Service
    authorizationService.setLogService(logService);
    authorizationService.setRepositoryService(repoService);
    authorizationService.setPermissionProvider(permissionProvider);
    authorizationService.setUserProvider(userProvider);
    authorizationService.setAppDataStore(appDataStore);
    authorizationService.setAuthenticationService(authenticationService);
    authorizationService.start();


    // Authentication Service
    authenticationService.setLogService(logService);
    authenticationService.setRepositoryService(repoService);
    authenticationService.setUserProvider(userProvider);
    authenticationService.setAppDataStore(appDataStore);
    authenticationService.setAuthorizationService(authorizationService);
    authenticationService.start();

})

describe("userService Test Setup", () => {
    it("userService is not null", () => {
        expect(userService).not.toBeNull();
    });
})