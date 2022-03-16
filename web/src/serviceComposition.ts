import {
    IDisplayService,
    IHttpService,
    ILogService,
    IRepositoryService,
    IScenarioService,
    ISelectionService,
    IStorage,
    IEntityProvider
} from "./framework.core.api";
import {AppDataStore} from "./framework.core/redux/reduxStore";
import {
    DisplayService,
    HttpService,
    LogService,
    RepositoryService,
    SelectionService
} from "./framework.core/services";

import {
    IAuthenticationService,
    IAuthorizationService,
    IDocumentService,
    IPocketService,
    IReferenceService,
    IStatService,
    ITagService,
    IUserProvider, IUserService
} from "./app.core.api";
import {
    DocumentInfo,
    ExcerptInfo,
    NoteInfo,
    PermissionInfo,
    PocketMapper,
    ReferenceInfo,
    ResourceInfo,
    RoleInfo,
    StatInfo,
    TagInfo
} from "./app.model";
import {
    AuthenticationService,
    AuthorizationService,
    DocumentProvider,
    DocumentService,
    PermissionProvider,
    PocketService,
    ReferenceProvider,
    ReferenceService,
    RoleProvider,
    StatProvider,
    StatService,
    TagProvider,
    TagService,
    UserProvider,
    UserService
} from "./app.core";
import {
    MockExcerptProvider,
    MockNoteProvider,
    MockPocketProvider,
    MockResourceProvider
} from "./app.testing/canary";
import {ScenarioService} from "./app.config/scenarioService";



export const appDataStore:IStorage = new AppDataStore();
export const logService: ILogService = new LogService();
export const repoService: IRepositoryService = new RepositoryService();
export const selectionService: ISelectionService = new SelectionService();
export const displayService: IDisplayService = new DisplayService();
const scenarioService: IScenarioService = new ScenarioService();
const httpService:IHttpService = new HttpService();


// create the entity providers
const documentProvider: IEntityProvider<DocumentInfo> = new DocumentProvider();
const referenceProvider: IEntityProvider<ReferenceInfo> = new ReferenceProvider();
const statProvider: IEntityProvider<StatInfo> = new StatProvider();
const tagProvider: IEntityProvider<TagInfo> = new TagProvider();
const roleProvider: IEntityProvider<RoleInfo> = new RoleProvider();
const userProvider: IUserProvider = new UserProvider();
const permissionProvider: IEntityProvider<PermissionInfo> = new PermissionProvider()
const noteProvider: IEntityProvider<NoteInfo> = new MockNoteProvider();
const excerptProvider: IEntityProvider<ExcerptInfo> = new MockExcerptProvider();
const resourceProvider: IEntityProvider<ResourceInfo> = new MockResourceProvider();
const pocketProvider: IEntityProvider<PocketMapper> = new MockPocketProvider();


// create the application services
export const authenticationService: IAuthenticationService = new AuthenticationService();
export const authorizationService: IAuthorizationService = new AuthorizationService();
export const documentService: IDocumentService = new DocumentService();
export const referenceService: IReferenceService = new ReferenceService();
export const statService: IStatService = new StatService();
export const tagService: ITagService = new TagService();
export const userService: IUserService = new UserService();
export const pocketService: IPocketService = new PocketService();


// create the ui plugins. jk. that's alot of work.







//
// set references and start framework plugins
//
// log service
logService.configure();
logService.start();
// repo service
repoService.setLogService(logService);
repoService.setStorage(appDataStore);
repoService.start();
// selection service
selectionService.setLogService(logService);
selectionService.setAppDataStore(appDataStore);
selectionService.start();
// display service
displayService.setLogService(logService);
displayService.setStorage(appDataStore)
displayService.start();
// scenario service
scenarioService.setLogService(logService);
scenarioService.setRepositoryService(repoService);
scenarioService.setDataAppStore(appDataStore);
scenarioService.start();
// http service
httpService.setLogService(logService);
httpService.setAuthenticationService(authenticationService);
httpService.start();


// set references and start entity providers
// documents
documentProvider.setLogService(logService);
documentProvider.setRepositoryService(repoService);
documentProvider.setHttpService(httpService);
documentProvider.start();
// references
referenceProvider.setLogService(logService);
referenceProvider.setRepositoryService(repoService);
referenceProvider.setHttpService(httpService);
referenceProvider.start();
// stats
statProvider.setLogService(logService);
statProvider.setRepositoryService(repoService);
statProvider.setHttpService(httpService);
statProvider.start();
// tags
tagProvider.setLogService(logService);
tagProvider.setRepositoryService(repoService);
tagProvider.setHttpService(httpService);
tagProvider.start();
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

// resources
resourceProvider.setLogService(logService);
resourceProvider.setRepositoryService(repoService);
resourceProvider.setHttpService(httpService);
resourceProvider.start();

// excerpts
excerptProvider.setLogService(logService);
excerptProvider.setRepositoryService(repoService);
excerptProvider.setHttpService(httpService);
excerptProvider.start();

// notes
noteProvider.setLogService(logService);
noteProvider.setRepositoryService(repoService);
noteProvider.setHttpService(httpService);
noteProvider.start();

// pockets
pocketProvider.setLogService(logService);
pocketProvider.setRepositoryService(repoService);
pocketProvider.setHttpService(httpService);
pocketProvider.start();


// set references and start application application
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
// document service
documentService.setLogService(logService);
documentService.setRepositoryService(repoService);
documentService.setUserService(userService);
documentService.setDocumentProvider(documentProvider);
documentService.start();
// reference service
referenceService.setLogService(logService);
referenceService.setRepositoryService(repoService);
referenceService.setReferenceProvider(referenceProvider);
referenceService.start();
// stat service
statService.setLogService(logService);
statService.setRepositoryService(repoService);
statService.setStatProvider(statProvider);
statService.start();
// tag service
tagService.setLogService(logService);
tagService.setRepositoryService(repoService);
tagService.setTagProvider(tagProvider);
tagService.start();
// user service
userService.setLogService(logService);
userService.setRepositoryService(repoService);
userService.setSelectionService(selectionService);
userService.setReferenceService(referenceService);
userService.setUserProvider(userProvider);
userService.setAuthorizationService(authorizationService);
userService.setAuthenticationService(authenticationService);
userService.start();
// pocket service
pocketService.setLogService(logService);
pocketService.setRepositoryService(repoService);
pocketService.setSelectionService(selectionService);
pocketService.setDocumentService(documentService);
pocketService.setResourceProvider(resourceProvider);
pocketService.setExcerptProvider(excerptProvider);
pocketService.setNoteProvider(noteProvider);
pocketService.setPocketProvider(pocketProvider);
pocketService.start();

// for the UI Components, using the Provider/Consumer pattern seems to be the way to go
// not entirely sure yet for those pieces


