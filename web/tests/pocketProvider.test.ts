import {
    AuthenticationService,
    AuthorizationService,
    PermissionProvider, PocketProvider,
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
import {PermissionInfo, PocketInfo, PocketMapper, RoleInfo} from "../src/app.model";
import {NodeFetchAdapter} from "../src/framework.core/networking/nodeFetchAdapter";

const pocketProvider: PocketProvider = new PocketProvider();
let pocketId: string = "";

beforeAll(() => {
    const appDataStore: IStorage = new AppDataStore();
    const logService: ILogService = new LogService();
    const repoService: IRepositoryService = new RepositoryService();
    const fetchAdapter: IFetchAdapter = new NodeFetchAdapter();
    const httpService: IHttpService = new HttpService();
    const userProvider: IUserProvider = new UserProvider();

    // create the entity providers
    const roleProvider: IEntityProvider<RoleInfo> = new RoleProvider();
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

    pocketProvider.setLogService(logService);
    pocketProvider.setRepositoryService(repoService);
    pocketProvider.setHttpService(httpService);
    pocketProvider.start();
})

describe("Test setup", () => {
    it("pocketProvider is not null", () => {
        expect(pocketProvider).not.toBeNull();
    });
})

describe("create", () => {
    it("creates a pocket", () => {
        const mockPocket: Partial<PocketInfo> = {
            title: "Test Pocket",
        }

        return pocketProvider.create(mockPocket).then(data => {
            expect(data.pocket).not.toBeNull();
            //set id for use in other tests
            pocketId = data.pocket.id;
            expect(data.pocket.title).toBe("Test Pocket");
        })
    })
})

describe("update", () => {
    it("updates a pocket", () => {
        const mockPocket: PocketInfo = new PocketInfo(pocketId);

        mockPocket.title = "Test Pocket Update";

        const mockPocketMapper: PocketMapper = new PocketMapper(mockPocket)

        return pocketProvider.update(pocketId, mockPocketMapper).then(data => {
            expect(data.pocket).not.toBeNull();
            expect(data.id).toBe(pocketId);
            expect(data.pocket.title).toBe("Test Pocket Update");
        })
    })
})

describe("getSingle", () => {
    it("get a single pocket", () => {
        return pocketProvider.getSingle(pocketId).then(data => {
            expect(data.pocket).not.toBeNull();
            expect(data.id).toBe(pocketId);
        })
    })
});

describe("getAll", () => {
    // it("gets a list of all the pockets", () => {
    //     return pocketProvider.getAll("NULL").then(data => {
    //         expect(data.length).not.toBe(0);
    //     })
    // });
});

describe("remove", () => {
    it("removes a pocket", () => {
        return pocketProvider.remove(pocketId).then(data => {
            expect(data.pocket).not.toBeNull();
            expect(data.id).toBe(pocketId);
        })
    })
})
