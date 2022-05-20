import {
    IEntityProvider,
    IFetchAdapter,
    IHttpService,
    ILogService,
    IRepositoryService,
    IStorage
} from "../../src/framework.core.api";
import {HttpService, LogService, RepositoryService} from "../../src/framework.core/services";
import {AppDataStore} from "../../src/framework.core/redux/reduxStore";
import {IAuthenticationService, IStatService} from "../../src/app.core.api";
import {AuthenticationService, StatProvider, StatService} from "../../src/app.core";
import {NodeFetchAdapter} from "../../src/framework.core/networking/nodeFetchAdapter";

const statService: IStatService = new StatService();

beforeAll(() => {
    const logService: ILogService = new LogService();
    const repoService: IRepositoryService = new RepositoryService();
    const appDataStore: IStorage = new AppDataStore();
    const fetchAdapter: IFetchAdapter = new NodeFetchAdapter();

    // providers
    const statProvider: StatProvider = new StatProvider();

    // services
    const authenticationService: IAuthenticationService = new AuthenticationService();
    const httpService: IHttpService = new HttpService();

    // log service
    logService.configure();
    logService.start();

    // repo service
    repoService.setLogService(logService);
    repoService.setStorage(appDataStore);
    repoService.start();

    // stat service
    statService.setLogService(logService);
    statService.setRepositoryService(repoService);
    statService.setStatProvider(statProvider);
    statService.start();

    // stat provider
    statProvider.setLogService(logService);
    statProvider.setRepositoryService(repoService);
    statProvider.setHttpService(httpService);
    statProvider.start();

    // http service
    httpService.setLogService(logService);
    httpService.setFetchAdapter(fetchAdapter);
    httpService.setAuthenticationService(authenticationService);
    httpService.start();
})

describe("Test Setup", () => {
    it("statService is not null", () => {
        expect(statService).not.toBeNull();
    })
})