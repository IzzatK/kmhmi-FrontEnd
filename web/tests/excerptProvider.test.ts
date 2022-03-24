import {
    AuthenticationService,
    AuthorizationService, ExcerptProvider,
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
import {ExcerptInfo, PermissionInfo, RoleInfo} from "../src/app.model";
import {NodeFetchAdapter} from "../src/framework.core/networking/nodeFetchAdapter";


const excerptProvider: IEntityProvider<ExcerptInfo> = new ExcerptProvider();
const testExcerpt: ExcerptInfo = new ExcerptInfo("tempId");

beforeAll(() => {
    testExcerpt.text = "This is a test excerpt text";
    testExcerpt.content = "This is a test excerpt content";
    // testExcerpt.location = "www.testlocation.com/thisdocument";
    testExcerpt.authorId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
    // testExcerpt.noteIds = [];

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
    // excerpts
    excerptProvider.setLogService(logService);
    excerptProvider.setRepositoryService(repoService);
    excerptProvider.setHttpService(httpService);
    excerptProvider.start();
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

describe("Test setup", () => {
    it("excerptProvider is not null", () => {
        expect(excerptProvider).not.toBeNull();
    });
});

describe("create", () => {
    let excerpt: ExcerptInfo;

    it("creates an excerpt", () => {
        return excerptProvider.create(testExcerpt).then(receivedExcerpt => {
            expect(receivedExcerpt).not.toBeNull();
            testExcerpt.id = receivedExcerpt.id;
            excerpt = receivedExcerpt;
        });
    });
    it("has matching values", () => {
        expect(excerpt).toEqual(testExcerpt);
    });
});

describe("getSingle", () => {
    describe("Get a single excerpt that exists", () => {
        let excerpt: ExcerptInfo;
        it("has a valid id", () => {
            expect(testExcerpt.id).not.toBe("");
        });

        it("gets a single excerpt", () => {
            return excerptProvider.getSingle(testExcerpt.id).then(receivedExcerpt => {
                expect(receivedExcerpt).not.toBeNull();
                excerpt = receivedExcerpt;
            });
        });
        it("has matching values", () => {
            expect(excerpt).toEqual(testExcerpt);
        });
    });

    // TODO: test getting an excerpt that doesn't exist
});

describe("update", () => {

});

describe("remove", () => {
    it("removes an excerpt", () => {
        return excerptProvider.remove(testExcerpt.id).then(excerpt => {
            expect(excerpt).not.toBeNull();
        });
    });
    it("cannot get the removed excerpt", () => {
        return excerptProvider.getSingle(testExcerpt.id).then(receivedExcerpt => {
            expect(receivedExcerpt).toBeNull();
        })
    })
});
