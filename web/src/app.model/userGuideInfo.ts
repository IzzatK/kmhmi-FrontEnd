import {RepoItem} from "../framework.core/services";

export class UserGuideInfo extends RepoItem {

    public static class: string = 'UserGuideInfo';

    preview_url: string = '';

    constructor(id: string) {
        super(id);

        this.appendClassName(UserGuideInfo.class);
    }
}