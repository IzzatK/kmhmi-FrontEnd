import {
    AuthenticationService,
    AuthorizationService,
    PermissionProvider, ResourceProvider,
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
import {PermissionInfo, ResourceInfo, RoleInfo} from "../src/app.model";
import {NodeFetchAdapter} from "../src/framework.core/networking/nodeFetchAdapter";


const resourceProvider: IEntityProvider<ResourceInfo> = new ResourceProvider();
let testResource: ResourceInfo = new ResourceInfo("");

beforeAll(() => {
    testResource.title = "Test Resource Title";

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
    // resources
    resourceProvider.setLogService(logService);
    resourceProvider.setRepositoryService(repoService);
    resourceProvider.setHttpService(httpService);
    resourceProvider.start();
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
    it("resourceProvider is not null", () => {
        expect(resourceProvider).not.toBeNull();
    });
});

describe("create", () => {
    let resource: ResourceInfo;

    it("creates a resource", () => {
        return resourceProvider.create(testResource).then(receivedResource => {
            expect(receivedResource).not.toBeNull();
            testResource.id = receivedResource.id;
            resource = receivedResource;
        });
    });
    it("has matching values", () => {
        expect(resource).toEqual(testResource);
    });
});

describe("getSingle", () => {
    describe("Get a single resource that exists", () => {
        let resource: ResourceInfo;
        it("has a valid id", () => {
            expect(testResource.id).not.toBe("");
        });

        it("gets a single resource", () => {
            return resourceProvider.getSingle(testResource.id).then(receivedResource => {
                expect(receivedResource).not.toBeNull();
                resource = receivedResource;
            });
        });
        it("has matching values", () => {
            expect(resource).toEqual(testResource);
        });
    })

    // TODO: test getting a resource that doesn't exist
});

describe("update", () => {
    
});

describe("remove", () => {
    it("removes a resource", () => {
        return resourceProvider.remove(testResource.id).then(resource => {
            expect(resource).not.toBeNull();
        });
    });
    it("cannot get the removed resource", () => {
        return resourceProvider.getSingle(testResource.id).then(receivedResource => {
            expect(receivedResource).toBeNull();
        });
    });
});
