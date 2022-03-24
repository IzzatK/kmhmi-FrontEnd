import {
    AuthenticationService,
    AuthorizationService, NoteProvider,
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
import {NoteInfo, PermissionInfo, RoleInfo} from "../src/app.model";
import {NodeFetchAdapter} from "../src/framework.core/networking/nodeFetchAdapter";


const noteProvider: IEntityProvider<NoteInfo> = new NoteProvider();
const testNote: NoteInfo = new NoteInfo("");

beforeAll(() => {
    testNote.text = "This is a test note text";
    testNote.content = "This is a test note content";
    // testNote.author_id = "";

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
    // notes
    noteProvider.setLogService(logService);
    noteProvider.setRepositoryService(repoService);
    noteProvider.setHttpService(httpService);
    noteProvider.start();
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
    it("noteProvider is not null", () => {
        expect(noteProvider).not.toBeNull();
    });
});

describe("create", () => {
    let note: NoteInfo;

    it("creates a note", () => {
        return noteProvider.create(testNote).then(receivedNote => {
            expect(receivedNote).not.toBeNull();
            testNote.id = receivedNote.id;
            note = receivedNote;
        });
    });
    it("has matching values", () => {
        expect(note).toEqual(testNote);
    });
});

describe("getSingle", () => {
    describe("Get a single note that exists", () => {
        let note: NoteInfo;
        it("has a valid id", () => {
            expect(testNote.id).not.toBe("");
        });

        it("gets a single note", () => {
            return noteProvider.getSingle(testNote.id).then(receivedNote => {
                expect(receivedNote).not.toBeNull();
                note = receivedNote;
            });
        });
        it("has matching values", () => {
            expect(note).toEqual(testNote);
        });
    });

    // TODO: test getting a note that doesn't exist
});

describe("update", () => {
    
});

describe("remove", () => {
    it("removes a note", () => {
        expect(testNote.id).not.toBe("");

        return noteProvider.remove(testNote.id).then(note => {
            expect(note).not.toBeNull();
        });
    });
    it("cannot get the removed resource", () => {
        return noteProvider.getSingle(testNote.id).then(receivedNote => {
            expect(receivedNote).toBeNull();
        })
    });
});
