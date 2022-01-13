import {RepoItem} from "../framework/services/repoService/repoItem";

export class UserRequestInfo extends RepoItem {
    public static class: string = 'UserRequestInfo';

    user_id: string = "";
    role: string = "";
    duration: string = "";
    comment: string = "";

    constructor(id: string)
    {
        super(id);

        this.appendClassName(UserRequestInfo.class);
    }
}
