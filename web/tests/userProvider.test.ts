import {
    AuthenticationService,
    AuthorizationService,
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
import {PermissionInfo, RoleInfo, UserInfo} from "../src/app.model";
import {NodeFetchAdapter} from "../src/framework.core/networking/nodeFetchAdapter";

const userProvider: IUserProvider = new UserProvider();

beforeAll(() => {
    const appDataStore: IStorage = new AppDataStore();
    const logService: ILogService = new LogService();
    const repoService: IRepositoryService = new RepositoryService();
    const fetchAdapter: IFetchAdapter = new NodeFetchAdapter();
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
    it("userProvider is not null", () => {
        expect(userProvider).not.toBeNull();
    });
})

describe("getAll", () => {
    it("gets a list of all the users", () => {
        return userProvider.getAll("NULL").then(users => {
            expect(users.length).not.toBe(0);
        })
    });

    it("gets a specifid user \"Gwaltney\"", () => {
        return userProvider.getAll("Gwaltney").then(users => {
            expect(users.length).toBeGreaterThanOrEqual(1);
            let user: UserInfo = users.at(0);
            expect(user.dod_id.toString()).not.toBe("");
            expect(user.first_name).not.toBe("");
            expect(user.last_name).toMatch("Gwaltney");
            expect(user.email_address).not.toBe("");
            expect(user.phone_number).not.toBe("");
            expect(user.department).not.toBe("");
            expect(user.preferred_results_view).not.toBe("");
            expect(user.account_status).not.toBe("");
            expect(user.role).not.toBe("");
            expect(user.approved_by).not.toBe("");
            expect(user.date_approved).not.toBe("");
            expect(user.isUpdating).not.toBe("");
        })
    });

    // TODO: test users that don't exist
    // it("gets an empty response for a user that doesn't exist", () => {
    //     return userProvider.getAll("user_name_that_doesnt_exist").then(users => {
    //         // expect(true).toBe(true);
    //         expect(users.length).toBe(0);
    //     })
    // });
});

describe("getRole", () => {

})

describe("getSingle", () => {
    let users: UserInfo[];

    beforeAll(() => {
        return userProvider.getAll("NULL").then(data => {
            users = data;
        });
    });

    it("gets a single user with an ID", () => {
        // test with the first user in the list
        let testUser: UserInfo = users.at(0);
        let userId: string = testUser.id;

        return userProvider.getSingle(userId).then(user => {
            expect(user.id).toBe(userId);

            expect(user.dod_id).toBe(testUser.dod_id);
            expect(user.first_name).toBe(testUser.first_name);
            expect(user.last_name).toBe(testUser.last_name);
            expect(user.email_address).toBe(testUser.email_address);
            expect(user.phone_number).toBe(testUser.phone_number);
            expect(user.department).toBe(testUser.department);
            expect(user.preferred_results_view).toBe(testUser.preferred_results_view);
            expect(user.account_status).toBe(testUser.account_status);
            expect(user.role).toBe(testUser.role);
            expect(user.approved_by).toBe(testUser.approved_by);
            expect(user.date_approved).toBe(testUser.date_approved);
            expect(user.isUpdating).toBe(testUser.isUpdating);
        })
    });
})

describe("create", () => {

})

describe("update", () => {

})

describe("remove", () => {

})