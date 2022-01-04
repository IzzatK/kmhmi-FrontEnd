import {RepoItem} from "../framework/services/repoService/repoItem";

export class RoleInfo extends RepoItem {
    public static class: string = 'RoleInfo';

    id: string = '';
    title: string = '';

    constructor(id: string)
    {
        super(id);

        this.appendClassName(RoleInfo.class);
    }
}


