import {UserProvider} from "../src/app.core";
import {logService, repoService} from "../src/serviceComposition";
// import {UserProvider} from "../src/app.core/users/providers/userProvider";
// import {UserInfo} from "../src/app.model";
// import {RepoItem} from "../src/framework.core/services";
// import {makeGuid} from "../src/framework.core/extras/utils/uniqueIdUtils";
// import {UpdateUserRequestConverter} from "../src/app.core";

describe("A suite", function() {
    let userProvider: UserProvider = new UserProvider();
    // userProvider.setLogService(logService);
    // userProvider.setRepositoryService(repoService);
    // userProvider.setHttpService(httpService);
    // userProvider.setRoleProvider(roleProvider);
    // userProvider.start();
    // let user: UserInfo;
    // let repoItem: RepoItem;
    // let id = makeGuid();
    // let converter: UpdateUserRequestConverter;

    it("contains spec with an expectation", function() {
        expect(true).toBe(true);
    });
});