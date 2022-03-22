import {
    AuthenticationService,
    AuthorizationService,
    PermissionProvider, ReferenceProvider,
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
import {PermissionInfo, ReferenceInfo, ReferenceType, RoleInfo} from "../src/app.model";
import {NodeFetchAdapter} from "../src/framework.core/networking/nodeFetchAdapter";

const referenceProvider: IEntityProvider<ReferenceInfo> = new ReferenceProvider();

beforeAll(() => {
    const appDataStore: IStorage = new AppDataStore();
    const logService: ILogService = new LogService();
    const repoService: IRepositoryService = new RepositoryService();
    const fetchAdapter: IFetchAdapter = new NodeFetchAdapter();
    const httpService: IHttpService = new HttpService();

    // create the entity providers
    const roleProvider: IEntityProvider<RoleInfo> = new RoleProvider();
    const userProvider: IUserProvider = new UserProvider();
    const permissionProvider: IEntityProvider<PermissionInfo> = new PermissionProvider();

    // create the application services
    const authenticationService: IAuthenticationService = new AuthenticationService();
    const authorizationService: IAuthorizationService = new AuthorizationService();


    // set references and start framework plugins
    // references
    referenceProvider.setLogService(logService);
    referenceProvider.setRepositoryService(repoService);
    referenceProvider.setHttpService(httpService);
    referenceProvider.start();
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
})

describe("Test setup", () => {
    it("referenceProvider is not null", () => {
        expect(referenceProvider).not.toBeNull();
    });
})

describe("getAll DEPARTMENT", () => {
    it("gets all departments", () => {
        let referenceOrdinal = ReferenceType[ReferenceType.DEPARTMENT];
        return referenceProvider.getAll({id: referenceOrdinal}).then(references => {
            expect(references.length).not.toBe(0);
        });
    });
});

describe("getAll PURPOSE", () => {
    it("gets all purposes", () => {
        let referenceOrdinal = ReferenceType[ReferenceType.PURPOSE];
        return referenceProvider.getAll({id: referenceOrdinal}).then(references => {
            expect(references.length).not.toBe(0);
        });
    });
});

describe("getAll ROLE", () => {
    it("gets all roles", () => {
        let referenceOrdinal = ReferenceType[ReferenceType.ROLE];
        return referenceProvider.getAll({id: referenceOrdinal}).then(references => {
            expect(references.length).not.toBe(0);
        });
    });
});

// describe("getAll STATUS", () => {
//     it("gets all statuses", () => {
//         let referenceOrdinal = ReferenceType[ReferenceType.STATUS];
//         return referenceProvider.getAll({id: referenceOrdinal}).then(references => {
//             expect(references.length).not.toBe(0);
//         });
//     });
// });

describe("getAll SHARED-TAGS", () => {
    // TODO: test SHARED-TAGS
    // it("gets all shared tags", () => {
    //     let referenceOrdinal = ReferenceType[ReferenceType.SHARED_TAGS];
    //     return referenceProvider.getAll({id: referenceOrdinal}).then(references => {
    //         expect(references.length).not.toBe(0);
    //     });
    // });
});
