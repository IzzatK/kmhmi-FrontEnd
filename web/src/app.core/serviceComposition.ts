import {RepositoryService} from "../framework/services/repoService/repoService";
import {ILogService, IStorage} from "../framework.api";
import {LogService} from "../framework/services/logService/logService";
import {SelectionService} from "../framework/services/selectionService/selectionService";
import {DisplayService} from "../framework/services/displayService/displayService";
import {DocumentService} from "./documents/documentService";
import {ReferenceService} from "./references/referenceService";
import {UserService} from "./users/userService";
import {AuthenticationService} from "./authentication/authenticationService";
import {StatService} from "./stats/statService";
import {TagService} from "./tags/tagService";
import {ScenarioService} from "./scenarioService/scenarioService";
import {UserProvider} from "./users/providers/userProvider";
import {IRepositoryService} from "../framework.api";
import {ISelectionService} from "../framework.api";
import {IDisplayService} from "../framework.api";
import {IAuthorizationService, IScenarioService} from "../app.core.api";
import {IAuthenticationService} from "../app.core.api";
import {IDocumentService} from "../app.core.api";
import {IReferenceService} from "../app.core.api";
import {IStatService} from "../app.core.api";
import {ITagService} from "../app.core.api";
import {IUserService} from "../app.core.api";
import {IEntityProvider} from "../app.core.api";
import {HttpService} from "../framework/services/httpService/httpService";
import {IHttpService} from "../framework.api";
import {
    DocumentInfo,
    ReferenceInfo,
    StatInfo,
    TagInfo,
    RoleInfo} from "../app.model";
import {DocumentProvider} from "./documents/providers/documentProvider";
import {ReferenceProvider} from "./references/providers/referenceProvider";
import {StatProvider} from "./stats/providers/statProvider";
import {TagProvider} from "./tags/providers/tagProvider";
import {IUserProvider} from "../app.core.api";
import {RoleProvider} from "./users/providers/roleProvider";
import {AppDataStore} from "../framework/redux/reduxStore";
import {PermissionInfo} from "../app.model/permissionInfo";
import {PermissionProvider} from "./authorization/providers/permissionProvider";
import {AuthorizationService} from "./authorization/authorizationService";

// create the framework plugins
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


// create the application application
export const authenticationService: IAuthenticationService = new AuthenticationService();
export const authorizationService: IAuthorizationService = new AuthorizationService();
export const documentService: IDocumentService = new DocumentService();
export const referenceService: IReferenceService = new ReferenceService();
export const statService: IStatService = new StatService();
export const tagService: ITagService = new TagService();
export const userService: IUserService = new UserService();


// create the ui application. jk. that's alot of work.







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

permissionProvider.setLogService(logService);
permissionProvider.setRepositoryService(repoService);
permissionProvider.setHttpService(httpService);
permissionProvider.start();


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

// for the UI Components, using the Provider/Consumer pattern seems to be the way to go
// not entirely sure yet for those pieces


