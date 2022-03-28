import {
    AuthenticationService,
    AuthorizationService,
    DocumentProvider,
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
import {DocumentInfo, ParamType, PermissionInfo, ReferenceType, RoleInfo, SearchParamInfo} from "../src/app.model";
import {NodeFetchAdapter} from "../src/framework.core/networking/nodeFetchAdapter";
import {nameOf, Nullable} from "../src/framework.core/extras/utils/typeUtils";
import {forEachKVP} from "../src/framework.core/extras/utils/collectionUtils";
import {getDateWithoutTime} from "../src/framework.core/extras/utils/timeUtils";

const documentProvider: IEntityProvider<DocumentInfo> = new DocumentProvider();
const repoService: IRepositoryService = new RepositoryService();

beforeAll(() => {
    const appDataStore: IStorage = new AppDataStore();
    const logService: ILogService = new LogService();
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
    // documents
    documentProvider.setLogService(logService);
    documentProvider.setRepositoryService(repoService);
    documentProvider.setHttpService(httpService);
    documentProvider.start();
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


    const createScenarioItem = function (id: string, ctor: {new(id: string): SearchParamInfo}, args: Record<string, any>) {
        const repoItem = new ctor(id);

        const dictionary: Record<string, any> = repoItem;

        forEachKVP(args, (key: string, value: any) => {
            if (key in repoItem) {
                dictionary[key] = value;
            }
        });

        repoService.addOrUpdateRepoItem(repoItem);
    };

    const createSearchParamInfo = function (id: string, type: ParamType, value: any, options: any, optionsId: Nullable<string>, title: string, visible: boolean, advanced: boolean, dirty: boolean) {
        createScenarioItem(id, SearchParamInfo, {
            [nameOf<SearchParamInfo>('type')]: type,
            [nameOf<SearchParamInfo>('value')]: value,
            [nameOf<SearchParamInfo>('options')]: options,
            [nameOf<SearchParamInfo>('optionsId')]: optionsId,
            [nameOf<SearchParamInfo>('title')]: title,
            [nameOf<SearchParamInfo>('visible')]: visible,
            [nameOf<SearchParamInfo>('advanced')]: advanced,
            [nameOf<SearchParamInfo>('dirty')]: dirty,
        })
    };

    createSearchParamInfo('search_request', ParamType.STRING, '', null, null, 'Include Text', false, false, false);
    createSearchParamInfo('exclude_search_request', ParamType.STRING, '', null, null, 'Exclude Text', true, true, false);
    createSearchParamInfo('sort', ParamType.OPTIONS, 'author_ascending', null, null, 'Sort', false, false, false);
    createSearchParamInfo('offset', ParamType.STRING, '', null, null, 'Offset', false, false, false);
    createSearchParamInfo('limit', ParamType.STRING, '', null, null, 'Limit', false, false, false);
    createSearchParamInfo('title', ParamType.STRING, '', null, null, 'Title', true, true, false);
    createSearchParamInfo('author', ParamType.STRING, '', null, null, 'Author', true, true, false);
    createSearchParamInfo('department', ParamType.OPTIONS, '', {}, ReferenceType.DEPARTMENT, 'Department', true, false, false);
    createSearchParamInfo('purpose', ParamType.OPTIONS, '', {}, ReferenceType.PURPOSE, 'Purpose', true, false, false);
    createSearchParamInfo('projects', ParamType.STRING, '', null, null, 'Projects', true, true, false);
    createSearchParamInfo('tags', ParamType.STRING, '', null, null, 'Tags', true, false, false);
    createSearchParamInfo('upload_date', ParamType.DATE_RANGE,
        {
            start_date: getDateWithoutTime(new Date()),
            end_date: getDateWithoutTime(new Date())
        },
        null, null, 'Upload Date', true, true, false);

    createSearchParamInfo('publication_date', ParamType.DATE_RANGE,
        {
            start_date: getDateWithoutTime(new Date()),
            end_date: getDateWithoutTime(new Date())
        },
        null, null, 'Publication Date', true, true, false);
    createSearchParamInfo('user_search_request', ParamType.STRING, '', null, null, '', false, false, false);
})

describe("Test setup", () => {
    it("documentProvider is not null", () => {
        expect(documentProvider).not.toBeNull();
    });
    it("repoService is not null", () => {
        expect(repoService).not.toBeNull();
    });
});

describe("create", () => {
    // skip this for now
});

describe("remove", () => {
    // skip this for now
});

describe("getAll", () => {
    let totalDocsCount = 0;

    describe("get all documents", () => {
        let searchParams: Record<string, SearchParamInfo>;

        beforeAll(() => {
            searchParams = repoService.getAll(SearchParamInfo.class);
        });

        it("gets documents", () => {
            return documentProvider.getAll(searchParams).then(documents => {
                expect(documents).not.toBeNull();
                expect(documents.length).toBeGreaterThan(0);
                totalDocsCount = documents.length;
            });
        });
    });

    describe("search for a string", () => {
        let searchParams: Record<string, SearchParamInfo>;

        beforeAll(() => {
            searchParams = repoService.getAll(SearchParamInfo.class);
            searchParams['search_request'].value = 'cdc';
        });

        it("gets documents matching string", () => {
            return documentProvider.getAll(searchParams).then(documents => {
                expect(documents).not.toBeNull();
                expect(documents.length).toBeLessThan(totalDocsCount);
            });
        });
    });

    describe("search for a specific document", () => {

    });
});

describe("getSingle", () => {
    let documentToGet: DocumentInfo = null;

    beforeAll(() => {
        let searchParams: Record<string, SearchParamInfo>;
        searchParams = repoService.getAll(SearchParamInfo.class);
        return documentProvider.getAll(searchParams).then(documents => {
            if (documents.length > 0) {
                documentToGet = documents.at(0);
            }
        });
    });

    it("gets a single document", () => {
        expect(documentToGet).not.toBeNull();

        return documentProvider.getSingle(documentToGet.id).then(document => {
            expect(document).toEqual(documentToGet);
        });
    });

    it("gets a document with hardcoded id", () => {
        return documentProvider.getSingle("a3fff3f2-0392-4ba3-ac6b-c9959c93f4f7").then(document => {
            expect(document).not.toBeNull();
        });
    })
});

describe("update", () => {
    const documentId = "a3fff3f2-0392-4ba3-ac6b-c9959c93f4f7";
    let documentToUpdate: DocumentInfo;

    beforeAll(() => {
        return documentProvider.getSingle(documentId).then(document => {
            documentToUpdate = document;
        });
    });

    it("updates document file name", () => {
        documentToUpdate.file_name = "test_document_api_file";
        documentToUpdate.author = "Bill Nye the Science Guy";
        documentToUpdate.publication_date = "2022-03-28";
        documentToUpdate.primary_sme_email = "user@example.com";
        documentToUpdate.secondary_sme_email = "user@example.com";
        return documentProvider.update(documentToUpdate.id, {id: documentToUpdate.id, modifiedDocument: documentToUpdate}).then(document => {
            expect(document).toEqual(documentToUpdate);
        })
    });
});

describe("getSearchParamValue", () => {

});
