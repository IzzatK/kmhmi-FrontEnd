import {
    IEntityProvider,
    IFetchAdapter,
    IHttpService,
    ILogService,
    IRepositoryService,
    ISelectionService,
    IStorage
} from "../../src/framework.core.api";
import {HttpService, LogService, RepositoryService, SelectionService} from "../../src/framework.core/services";
import {AppDataStore} from "../../src/framework.core/redux/reduxStore";
import {
    IAuthenticationService,
    IAuthorizationService,
    IReportService,
    IUserProvider,
    IUserService
} from "../../src/app.core.api";
import {
    AuthenticationService, AuthorizationService, PermissionProvider,
    PublishedReportProvider,
    ReportProvider,
    ReportService, RoleProvider, UserProvider,
    UserService
} from "../../src/app.core";
import {NodeFetchAdapter} from "../../src/framework.core/networking/nodeFetchAdapter";


const reportService: IReportService = new ReportService();

beforeAll(() => {
    const logService: ILogService = new LogService();
    const repoService: IRepositoryService = new RepositoryService();
    const appDataStore: IStorage = new AppDataStore();
    const fetchAdapter: IFetchAdapter = new NodeFetchAdapter();

    //Provider
    const publishedReportProvider: PublishedReportProvider = new PublishedReportProvider();
    const reportProvider: ReportProvider = new ReportProvider();
    const userProvider: IUserProvider = new UserProvider();
    const roleProvider: RoleProvider = new RoleProvider();
    const permissionProvider: PermissionProvider = new PermissionProvider();


    // Service
    const selectionService: ISelectionService = new SelectionService();
    const userService: IUserService = new UserService();
    const httpService: IHttpService = new HttpService();
    const authenticationService: IAuthenticationService = new AuthenticationService();
    const authorizationService: IAuthorizationService = new AuthorizationService();

    // Log service
    logService.configure();
    logService.start();

    // Repo Service
    repoService.setLogService(logService);
    repoService.setStorage(appDataStore);
    repoService.start();

    // Report Service
    reportService.setLogService(logService);
    reportService.setRepositoryService(repoService);
    reportService.setPublishedReportProvider(publishedReportProvider);
    reportService.setSelectionService(selectionService);
    reportService.setReportProvider(reportProvider);
    reportService.setUserService(userService);
    reportService.start();

    // Published Report Provider
    publishedReportProvider.setLogService(logService);
    publishedReportProvider.setRepositoryService(repoService);
    publishedReportProvider.setHttpService(httpService);
    publishedReportProvider.start();

    // Http service
    httpService.setLogService(logService);
    httpService.setFetchAdapter(fetchAdapter);
    httpService.setAuthenticationService(authenticationService);
    httpService.start();

    // User Provider
    userProvider.setLogService(logService);
    userProvider.setRoleProvider(roleProvider);
    userProvider.setHttpService(httpService);
    userProvider.setRepositoryService(repoService);
    userProvider.start();

    // Role Provider
    roleProvider.setLogService(logService);
    roleProvider.setRepositoryService(repoService);
    roleProvider.setHttpService(httpService);
    roleProvider.start();

    // Authentication Service
    authenticationService.setAuthorizationService(authorizationService);
    authenticationService.setAppDataStore(appDataStore);
    authenticationService.setRepositoryService(repoService);
    authenticationService.setLogService(logService);
    authenticationService.setUserProvider(userProvider);
    //authenticationService.setRegistrationStatus(registrationStatus);
    authenticationService.start();

    // Authorization Service
    authorizationService.setLogService(logService);
    authorizationService.setAppDataStore(appDataStore);
    authorizationService.setAuthenticationService(authenticationService);
    authorizationService.setPermissionProvider(permissionProvider);
    authorizationService.setUserProvider(userProvider);
    authorizationService.setRepositoryService(repoService);
    authorizationService.start();
})

describe("Setup Test", () => {
    it("reportService is not null", () => {
        expect(reportService).not.toBeNull();
    })
})
