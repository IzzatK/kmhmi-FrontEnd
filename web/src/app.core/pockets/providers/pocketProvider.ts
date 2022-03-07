import {EntityProvider} from "../../common/providers/entityProvider";
import {RepoItem} from "../../../framework.core/services/repoService/repoItem";

export const serverUrl = process.env.REACT_APP_SERVER_URL;

export class PocketProvider extends EntityProvider<RepoItem> {
    baseUrl: string = `${serverUrl}/pockets`;
    public static class: string = 'DocumentProvider';

    constructor() {
        super();
        super.appendClassName(PocketProvider.class);
    }

    start() {
        super.start();

    }
}


